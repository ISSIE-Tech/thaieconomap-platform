import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';

import { CODES, GLOBAL_CONFIG } from '../../shared/constants';
import { mapResponse } from '../../shared/utils';

@Catch(Error)
export class InternalExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger: Logger = new Logger('InternalError');

  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const isDev = this.configService.get<boolean>(GLOBAL_CONFIG.IS_DEV);
    const { statusCode, ...detail } = mapResponse(
      CODES.TEC_004,
      undefined,
      undefined,
      isDev ? exception.message : undefined,
    );

    this.logger.fatal(`${exception?.stack}`);

    response.status(statusCode).json(detail);
  }
}
