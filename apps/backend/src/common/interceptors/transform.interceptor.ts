import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CODES } from '../../shared/constants';
import { IResponse } from '../../shared/interfaces';
import { mapResponse } from '../../shared/utils';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> | Promise<Observable<IResponse<T>>> {
    return next.handle().pipe(
      map(data => {
        const { statusCode, ...response } = mapResponse(CODES.TEC_000, data);

        return response;
      }),
    );
  }
}
