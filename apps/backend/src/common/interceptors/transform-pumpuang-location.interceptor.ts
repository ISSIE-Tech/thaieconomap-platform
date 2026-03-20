import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable, map } from 'rxjs';

import {
  convertToGeoJsonLineStringFromCoordinates,
  convertToGeoJsonPointFromCoordinates,
} from '../../shared/utils';

type Response<T> = T | T[];

@Injectable()
export class TransformPumpuangLocation<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data)) {
          return data.length ? data.map(this.transformLocation) : data;
        }

        return this.transformLocation(data);
      }),
    );
  }

  private transformLocation(data) {
    if (data?.current?.location) {
      data.current.location = convertToGeoJsonPointFromCoordinates(data.current.location);
    }

    if (Array.isArray(data?.history)) {
      data.history = data.history.map(history => {
        if (Array.isArray(history)) {
          return convertToGeoJsonLineStringFromCoordinates(history);
        }
      });
    }

    return data;
  }
}
