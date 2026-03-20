import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosResponse } from 'axios';
import { Span } from 'nestjs-otel';
import { EMPTY, Observable, firstValueFrom } from 'rxjs';
import { expand, reduce } from 'rxjs/operators';

import { ErrorException } from '../../../common/exceptions';
import { CODES, GLOBAL_CONFIG, TAMSANG_TAMSONG_PATH } from '../../../shared/constants';
import {
  ITamsangTamsongBaseShopResponse,
  ITamsangTamsongResponse,
  ITamsangTamsongShopResponse,
} from '../../../shared/interfaces';
import { getSpanName, prettyObjectString } from '../../../shared/utils';

@Injectable()
export class TamsangTamsongService {
  private tamsangTamsongApi: string;
  private tamsangTamsongUrl: { [key: string]: string };
  private readonly logger: Logger = new Logger(TamsangTamsongService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.tamsangTamsongApi = this.configService.get(GLOBAL_CONFIG.TAMSANG_TAMSONG_API);
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

    const request = this.fetchData<T>(url);

    return firstValueFrom(
      request.pipe(
        expand(response =>
          response.data.nextPage
            ? this.fetchData<T>(
                `${url}?page=${response.data.nextPage}&perPage=${response.data.perPage}`,
              )
            : EMPTY,
        ),
        reduce((data, response) => data.concat(response.data.data), []),
      ),
    );
  }

  @Span('Fetch Data')
  private fetchData<T>(url: string): Observable<AxiosResponse<ITamsangTamsongResponse<T>>> {
    this.logger.debug(
      `{${TamsangTamsongService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        url,
      })}`,
    );

    try {
      return this.httpService.get(url);
    } catch (error) {
      this.logger.error(error);

      throw new ErrorException(CODES.TEC_028);
    }
  }
}
