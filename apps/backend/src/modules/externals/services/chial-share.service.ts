import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { isAxiosError } from 'axios';
import { Span } from 'nestjs-otel';
import { firstValueFrom } from 'rxjs';

import { ErrorException } from '../../../common/exceptions';
import { CHIAL_SHARE_PATH, CODES, GLOBAL_CONFIG } from '../../../shared/constants';
import {
  IChialShareJobCategory,
  IChialShareJobPost,
  IChialShareJobPostMark,
} from '../../../shared/interfaces';
import { getSpanName } from '../../../shared/utils';

// The job endpoints are public on csc-backend, so unlike tamsang-tamsong no key is sent.
@Injectable()
export class ChialShareService {
  private readonly chialShareApi: string;
  private readonly logger: Logger = new Logger(ChialShareService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.chialShareApi = this.configService.get(GLOBAL_CONFIG.CHIAL_SHARE_API);
  }

  @Span('List Job Post Marks')
  async listJobPostMarks(): Promise<IChialShareJobPostMark[]> {
    this.logger.debug(`{${ChialShareService.name}-[${getSpanName()}]} (called)`);

    return this.requireArray(
      (await this.get<{ data: IChialShareJobPostMark[] }>(CHIAL_SHARE_PATH.mapMarks))?.data,
    );
  }

  @Span('List Job Categories')
  async listJobCategories(): Promise<IChialShareJobCategory[]> {
    this.logger.debug(`{${ChialShareService.name}-[${getSpanName()}]} (called)`);

    return this.requireArray(
      (await this.get<{ jobCategories: IChialShareJobCategory[] }>(CHIAL_SHARE_PATH.categories))
        ?.jobCategories,
    );
  }

  /** Null when the post was closed or deleted after the marks were listed. */
  @Span('Get Job Post')
  async getJobPost(id: string): Promise<IChialShareJobPost | null> {
    this.logger.debug(`{${ChialShareService.name}-[${getSpanName()}]} (called)`);

    return (
      (await this.get<{ jobPost: IChialShareJobPost }>(CHIAL_SHARE_PATH.jobPost(id)))?.jobPost ??
      null
    );
  }

  // The sync deletes whatever a list leaves out, so a 404 or an odd body must not read as "no jobs".
  private requireArray<T>(items: T[] | undefined): T[] {
    if (!Array.isArray(items)) {
      throw new ErrorException(CODES.TEC_082);
    }

    return items;
  }

  private async get<T>(path: string): Promise<T | null> {
    try {
      return (await firstValueFrom(this.httpService.get<T>(this.chialShareApi + path))).data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === HttpStatus.NOT_FOUND) {
        return null;
      }

      this.logger.error(error);

      throw new ErrorException(CODES.TEC_082);
    }
  }
}
