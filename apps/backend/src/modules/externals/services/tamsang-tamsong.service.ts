import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosResponse } from 'axios';
import { Span } from 'nestjs-otel';
import { EMPTY, Observable, firstValueFrom, throwError } from 'rxjs';
import { catchError, expand, reduce } from 'rxjs/operators';

import { ErrorException } from '../../../common/exceptions';
import {
  CODES,
  GLOBAL_CONFIG,
  TAMSANG_TAMSONG_OPEN_API_KEY_HEADER,
  TAMSANG_TAMSONG_PATH,
  TAMSANG_TAMSONG_PER_PAGE,
} from '../../../shared/constants';
import {
  ITamsangTamsongBaseShopResponse,
  ITamsangTamsongResponse,
  ITamsangTamsongShopResponse,
} from '../../../shared/interfaces';
import { getSpanName, prettyObjectString } from '../../../shared/utils';

@Injectable()
export class TamsangTamsongService {
  private tamsangTamsongApi: string;
  private tamsangTamsongSecret: string;
  private tamsangTamsongUrl: { [key: string]: string };
  private readonly logger: Logger = new Logger(TamsangTamsongService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.tamsangTamsongApi = this.configService.get(GLOBAL_CONFIG.TAMSANG_TAMSONG_API);
    this.tamsangTamsongSecret = this.configService.get(GLOBAL_CONFIG.TAMSANG_TAMSONG_SECRET);
    this.tamsangTamsongUrl = {
      shops: this.tamsangTamsongApi + TAMSANG_TAMSONG_PATH.shops,
      bases: this.tamsangTamsongApi + TAMSANG_TAMSONG_PATH.bases,
    };
  }

  @Span('List Shops')
  async listShops(): Promise<ITamsangTamsongShopResponse[]> {
    this.logger.debug(`{${TamsangTamsongService.name}-[${getSpanName()}]} (called)`);

    return this.fetchPaginatedData<ITamsangTamsongShopResponse>(this.tamsangTamsongUrl.shops);
  }

  @Span('List Bases')
  async listBases(): Promise<ITamsangTamsongBaseShopResponse[]> {
    this.logger.debug(`{${TamsangTamsongService.name}-[${getSpanName()}]} (called)`);

    return this.fetchPaginatedData<ITamsangTamsongBaseShopResponse>(this.tamsangTamsongUrl.bases);
  }

  @Span('Fetch Paginated Data')
  private async fetchPaginatedData<T>(url: string): Promise<T[]> {
    this.logger.debug(
      `{${TamsangTamsongService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        url,
      })}`,
    );

    const request = this.fetchData<T>(url, 1);

    return firstValueFrom(
      request.pipe(
        expand(response =>
          response.data.page < response.data.totalPages
            ? this.fetchData<T>(url, response.data.page + 1)
            : EMPTY,
        ),
        reduce((data, response) => data.concat(response.data.items), []),
      ),
    );
  }

  @Span('Fetch Data')
  private fetchData<T>(
    url: string,
    page: number,
  ): Observable<AxiosResponse<ITamsangTamsongResponse<T>>> {
    this.logger.debug(
      `{${TamsangTamsongService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        url,
        page,
      })}`,
    );

    return this.httpService
      .get<ITamsangTamsongResponse<T>>(url, {
        headers: {
          [TAMSANG_TAMSONG_OPEN_API_KEY_HEADER]: this.tamsangTamsongSecret,
        },
        params: {
          page,
          perPage: TAMSANG_TAMSONG_PER_PAGE,
        },
      })
      .pipe(
        catchError(error => {
          this.logger.error(error);

          return throwError(() => new ErrorException(CODES.TEC_028));
        }),
      );
  }
}
