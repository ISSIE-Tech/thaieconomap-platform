import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Model } from 'mongoose';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../common/exceptions';
import { CODES } from '../../shared/constants';
import { IChialShareJobPost, IChialShareJobPostMark } from '../../shared/interfaces';
import { getSpanName } from '../../shared/utils';
import { ChialShareService } from '../externals/services';

import { SyncLogRepository } from './repositories';
import {
  CscJobCategory,
  CscJobCategoryDocument,
  CscJobPost,
  CscJobPostDocument,
  SyncSource,
  SyncStatus,
  SyncTrigger,
} from './schemas';

type CscJobPostRow = Pick<CscJobPost, '_id' | 'mark' | 'hidden'>;

// csc-backend answers one post per request; this caps how many run at once.
const DETAIL_CONCURRENCY = 5;

/**
 * Keeps a copy of csc-backend's public job data so the job map is served by this backend,
 * the same way tamsang-tamsong shops are. Hourly rather than nightly: new posts should show
 * up the same day, and the presigned image urls inside a post only last 7 days.
 */
@Injectable()
export class CscJobsService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(CscJobsService.name);

  constructor(
    @InjectModel(CscJobPost.name) private readonly jobPostModel: Model<CscJobPostDocument>,
    @InjectModel(CscJobCategory.name)
    private readonly jobCategoryModel: Model<CscJobCategoryDocument>,
    private readonly syncLogRepository: SyncLogRepository,
    private readonly chialShareService: ChialShareService,
  ) {}

  // A fresh deployment would otherwise show an empty job map until the next hour.
  // Not awaited, so a csc outage cannot hold up startup; failures land in the sync log.
  onApplicationBootstrap(): void {
    void this.scheduledJobSync();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async scheduledJobSync(): Promise<void> {
    await this.syncJobs(SyncTrigger.CRON, null).catch(() => undefined);
  }

  @Span('Sync Csc Jobs')
  async syncJobs(trigger: SyncTrigger, triggeredBy: string | null): Promise<void> {
    this.logger.debug(`{${CscJobsService.name}-[${getSpanName()}]} (called)`);

    const startedAt = Date.now();
    const counts = { jobsReceived: 0, jobsSaved: 0, jobCategoriesSaved: 0 };

    try {
      const [categories, marks] = await Promise.all([
        this.chialShareService.listJobCategories(),
        this.chialShareService.listJobPostMarks(),
      ]);

      counts.jobsReceived = marks.length;

      // Fetch everything before writing, so a csc outage mid-sync leaves the old cache intact.
      const posts = await this.fetchDetails(marks);

      await this.replaceAll(
        this.jobCategoryModel,
        categories.map((data, order) => ({ _id: String(data._id), order, data })),
      );
      await this.replaceAll(this.jobPostModel, posts);

      counts.jobCategoriesSaved = categories.length;
      counts.jobsSaved = posts.length;

      await this.recordSync(trigger, triggeredBy, SyncStatus.SUCCESS, startedAt, counts);
    } catch (error) {
      await this.recordSync(trigger, triggeredBy, SyncStatus.FAILURE, startedAt, counts, error);

      throw error instanceof ErrorException ? error : new ErrorException(CODES.TEC_004);
    }
  }

  async listMarks(category?: string) {
    const posts = await this.jobPostModel
      .find({ hidden: { $ne: true }, ...(category && { categoryId: category }) }, { mark: 1 })
      .lean();

    return posts.map(post => post.mark);
  }

  async listCategories() {
    const categories = await this.jobCategoryModel.find({}, { data: 1 }).sort({ order: 1 }).lean();

    return categories.map(category => category.data);
  }

  async listJobPosts(
    search: string | undefined,
    page: number,
    limit: number,
  ): Promise<{ data: CscJobPostRow[]; total: number }> {
    const query = search
      ? { 'mark.title': { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
      : {};

    const [data, total] = await Promise.all([
      this.jobPostModel
        .find(query, { mark: 1, hidden: 1 })
        .sort({ 'mark.title': 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<CscJobPostRow[]>(),
      this.jobPostModel.countDocuments(query),
    ]);

    return { data, total };
  }

  // Hides a job from the public map without touching csc itself.
  async setJobPostHidden(id: string, hidden: boolean): Promise<CscJobPostRow> {
    const post = await this.jobPostModel
      .findByIdAndUpdate(id, { hidden }, { new: true, projection: { mark: 1, hidden: 1 } })
      .lean<CscJobPostRow>();

    if (!post) {
      throw new ErrorException(CODES.TEC_083);
    }

    return post;
  }

  async getJobPost(id: string) {
    const post = await this.jobPostModel.findById(id, { detail: 1 }).lean();

    if (!post) {
      throw new ErrorException(CODES.TEC_083);
    }

    return post.detail;
  }

  private async fetchDetails(marks: IChialShareJobPostMark[]): Promise<CscJobPost[]> {
    const posts: CscJobPost[] = [];

    for (let i = 0; i < marks.length; i += DETAIL_CONCURRENCY) {
      const batch = marks.slice(i, i + DETAIL_CONCURRENCY);
      const details = await Promise.all(
        batch.map(mark => this.chialShareService.getJobPost(String(mark._id))),
      );

      batch.forEach((mark, index) => {
        const detail: IChialShareJobPost | null = details[index];

        // closed or deleted between the two calls
        if (!detail) return;

        posts.push({
          _id: String(mark._id),
          categoryId: mark.category?._id ? String(mark.category._id) : null,
          mark: { ...mark },
          detail: { ...detail },
        });
      });
    }

    return posts;
  }

  // Upsert what csc returned, then drop the rest; an empty list really means no open jobs.
  // $set rather than replace, so admin-only fields like `hidden` survive the sync.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async replaceAll<T extends { _id: string }>(model: Model<any>, docs: T[]): Promise<void> {
    if (docs.length > 0) {
      await model.bulkWrite(
        docs.map(({ _id, ...fields }) => ({
          updateOne: { filter: { _id }, update: { $set: fields }, upsert: true },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })) as any,
      );
    }

    await model.deleteMany({ _id: { $nin: docs.map(doc => doc._id) } });
  }

  // A failed history write must not mask the sync result, so it is only logged.
  private async recordSync(
    trigger: SyncTrigger,
    triggeredBy: string | null,
    status: SyncStatus,
    startedAt: number,
    counts: { jobsReceived: number; jobsSaved: number; jobCategoriesSaved: number },
    error?: unknown,
  ): Promise<void> {
    try {
      await this.syncLogRepository.create({
        source: SyncSource.CSC,
        trigger,
        triggeredBy,
        status,
        ...counts,
        durationMs: Date.now() - startedAt,
        errorMessage: error ? (error instanceof Error ? error.message : String(error)) : null,
      });
    } catch (logError) {
      this.logger.error(`Failed to record sync log: ${logError}`);
    }
  }
}
