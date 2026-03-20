import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { Request } from 'express';

@Injectable()
export class ProxiedThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(request: Request): Promise<string> {
    const forwarded = request.headers['x-forwarded-for'];
    const ip = forwarded?.toString().split(',')[0]?.trim();

    if (ip) {
      return ip;
    }

    return request.socket?.remoteAddress || request.connection?.remoteAddress || request.ip;
  }
}
