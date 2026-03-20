import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';

import { CODES, globalConfig } from '../../shared/constants';
import { mapResponse } from '../../shared/utils';

@Catch(Error)
export class InternalExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger('InternalError');

  constructor(private readonly configService: ConfigService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const isDev = this.configService.get<boolean>(globalConfig.IS_DEV);
    const { statusCode, ...detail } = mapResponse(
      CODES.AGW_004,
      undefined,
      undefined,
      isDev ? exception.message : undefined,
    );

    this.logger.fatal(`${exception?.stack}`);

    response.status(statusCode).json(detail);
  }
}
