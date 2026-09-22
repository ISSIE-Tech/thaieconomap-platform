import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JobPost, JobPostDocument } from '../schemas/job-post.schema';
import { Model, SortOrder } from 'mongoose';
import {
  JobCategory,
  JobCategoryDocument,
} from '../schemas/job-category.schema';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { GetJobPostsFilterDto } from '../dtos/get-job-posts-filter.dto';
import { PaginationProcesser } from 'src/common/utils/pagination';
import { JobPostSubmissionStatus } from '../schemas/job-post-submission-status.enum';
import { IBaseQueryJobPostsFilter } from '../interfaces/base-query-filters.interface';

@Injectable()
export class DeletedJobPostsService {
  constructor(
    private readonly minioClientService: MinioClientService,
    @InjectModel(JobPost.name)
    private readonly jobPostModel: Model<JobPostDocument>,
    @InjectModel(JobCategory.name)
    private readonly jobCategoryModel: Model<JobCategoryDocument>,
  ) {}

  async restoreDeletedJobPost(deletedJobPostId: string) {
    const deletedJobPost = await this.getDeletedJobPostById(deletedJobPostId);
    const newImageUrls = await Promise.all(
      deletedJobPost.imageUrls.map(async (imageUrl) => {
        return this.minioClientService.restoreObjectFromRecycleBin(imageUrl);
      }),
    );

    await deletedJobPost.updateOne({
      deletedAt: null,
      deletedBy: null,
      imageUrls: newImageUrls,
    });
  }

  async getDeletedJobPosts(getDeletedJobPostsFilterDto: GetJobPostsFilterDto) {
    const { page, perPage, ascending, district } = getDeletedJobPostsFilterDto;
    const paginator = new PaginationProcesser(page, perPage);

    const { numberOfSkipItems, numberOfLimit } =
      paginator.calculateSkipAndLimit();

    const query = this.calculateBaseQuery(getDeletedJobPostsFilterDto);

    if (district) {
      query['location.address.district'] = district;
    }

    let sortOrder: SortOrder = 'descending';
    if (ascending) {
      sortOrder = 'ascending';
    }

    const jobPostsQuery = this.jobPostModel
      .find(query)
      .sort({ createdAt: sortOrder })
      .skip(numberOfSkipItems)
      .limit(numberOfLimit)
      .populate([
        {
          path: 'createdBy',
          select: 'name phoneNumber',
        },
        {
          path: 'category',
        },
        {
          path: 'reviewedBy',
          select: 'shortId name phoneNumber',
        },
      ]);

    const count = await this.jobPostModel.count(query);

    if (!paginator.isPageNumberValid(count))
      throw new BadRequestException('Invalid page');

    const data = await jobPostsQuery;

    return paginator.response(count, data);
  }

  async delete(deletedJobPostId: string) {
    const deletedJobPost = await this.getDeletedJobPostById(deletedJobPostId);
    for (const imageUrl of deletedJobPost.imageUrls) {
      await this.minioClientService.delete(imageUrl);
    }
    await deletedJobPost.deleteOne();
  }

  async getDeletedJobPostById(deletedJobPostId: string) {
    const deletedJobPost = await this.jobPostModel
      .findOne({
        _id: deletedJobPostId,
        deletedAt: { $ne: null },
      })
      .populate('createdBy', '_id lineId name phoneNumber')
      .populate('category')
      .populate([
        {
          path: 'location.address.district',
        },
      ]);

    if (!deletedJobPost) {
      throw new NotFoundException();
    }

    return deletedJobPost;
  }

  private calculateBaseQuery(baseQuery: IBaseQueryJobPostsFilter) {
    const { category, searchTerm } = baseQuery;
    const query = {
      submissionStatus: JobPostSubmissionStatus.Approved,
      deletedAt: {
        $ne: null,
      },
    };

    if (category) {
      query['category'] = category;
    }

    if (searchTerm) {
      query['title'] = {
        $regex: searchTerm,
      };
    }

    return query;
  }
}
