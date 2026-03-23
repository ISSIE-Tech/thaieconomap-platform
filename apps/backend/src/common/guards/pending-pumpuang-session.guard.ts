import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisClientType } from 'redis';

import { CACHE_KEY, CODES, GLOBAL_CONFIG } from '../../shared/constants';
import { IPendingPumpuangSessionCache } from '../../shared/interfaces';
import { REDIS_CLIENT } from '../../shared/redis';
import { verifyHmacSha256Hash } from '../../shared/utils';
import { ErrorException } from '../exceptions';

@Injectable()
export class PendingPumpuangSessionGuard implements CanActivate {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
    private readonly configService: ConfigService,
  ) {}

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
