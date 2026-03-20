import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-yet';
import { RedisClientType } from 'redis';

import { CACHE_KEY, CODES, GLOBAL_CONFIG } from '../../shared/constants';
import { IPendingPumpuangSessionCache } from '../../shared/interfaces';
import { verifyHmacSha256Hash } from '../../shared/utils';
import { ErrorException } from '../exceptions';

@Injectable()
export class PendingPumpuangSessionGuard implements CanActivate {
  private redisClient: RedisClientType;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.redisClient = (this.cacheManager.store as RedisStore).client;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers?.['session-id'];

    if (!sessionId) {
      throw new ErrorException(CODES.TEC_002);
    }

    const sessionExists = (await this.redisClient.json.get(
      CACHE_KEY.pumpuang.session(sessionId),
    )) as unknown as IPendingPumpuangSessionCache;

    if (!sessionExists) {
      throw new ErrorException(CODES.TEC_002);
    }

    request.session = sessionExists;

    return verifyHmacSha256Hash(
      sessionId,
      this.configService.get<string>(GLOBAL_CONFIG.SESSION_SECRET),
      sessionExists.hashedSessionId,
    );
  }
}
