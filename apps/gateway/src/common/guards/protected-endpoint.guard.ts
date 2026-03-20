import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { globalConfig } from '../../shared/constants';

@Injectable()
export class ProtectedEndpoint implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const isDev = this.configService.get<boolean>(globalConfig.IS_DEV);
    const request = context.switchToHttp().getRequest<Request>();

    if (!isDev) {
      const message = `Cannot ${request.method} ${request.url}`;

      throw new NotFoundException(message);
    }

    return isDev;
  }
}
