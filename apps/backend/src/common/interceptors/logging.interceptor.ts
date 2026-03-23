import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

import { context as otelContext, trace } from '@opentelemetry/api';
import { Request, Response } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> | Promise<Observable<Response>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { url, method } = request;
    const userAgent = request.headers['user-agent'];
    const remoteIp =
      request.headers['x-forwarded-for'] || request.socket?.remoteAddress || request.ip;

    return next.handle().pipe(
      tap(() => {
        const span = trace.getSpan(otelContext.active());

        if (!span) {
          this.logger.log(`${method} ${url} ${response.statusCode} - ${userAgent} ${remoteIp}`);
        } else {
          const { spanId, traceId } = trace.getSpan(otelContext.active()).spanContext();

          this.logger.log(
            `${method} ${url} ${response.statusCode} - ${userAgent} ${remoteIp} "traceId":"${traceId}" "spanId":"${spanId}"`,
          );
        }
      }),

      catchError(error => {
        const statusCode =
          error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        this.logger.error(`${method} ${url} ${statusCode} - ${userAgent} ${remoteIp}`);

        return throwError(() => error);
      }),
    );
  }
}
