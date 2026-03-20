import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable, switchMap } from 'rxjs';

import { MinioClientService } from '../../modules/minio-client/minio-client.service';
import { IPaginationResponse } from '../../shared/interfaces';
import { transformFileUrl, transformFileUrlsInArray } from '../../shared/utils';

type Response<T> = T | T[] | IPaginationResponse<T>;

@Injectable()
export class TransformFileInterceptor<T> implements NestInterceptor {
  constructor(private readonly minioClientService: MinioClientService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    return next.handle().pipe(
      switchMap(async (data: Response<T>) => {
        if (this.isPaginationResponse(data)) {
          const paginateData = data as IPaginationResponse<T>;

          await transformFileUrlsInArray(this.minioClientService, paginateData.data);

          return paginateData;
        }

        if (data instanceof Array) {
          return transformFileUrlsInArray(this.minioClientService, data);
        }

        return transformFileUrl(this.minioClientService, data as T);
      }),
    );
  }

  private isPaginationResponse(data: Response<T>): boolean {
    return Boolean((data as IPaginationResponse<T>)?.metaData);
  }
}
