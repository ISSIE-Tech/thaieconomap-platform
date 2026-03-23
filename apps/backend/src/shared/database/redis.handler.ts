import { ConfigService } from '@nestjs/config';

import { RedisStore, redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

import { CONFIG } from '../../config';
import { GLOBAL_CONFIG } from '../constants';

export const RedisFactory = async (
  configService: ConfigService,
): Promise<{ store: RedisStore; ttl: number }> => {
  const options: RedisClientOptions = {
    socket: {
      host: configService.get<string>(GLOBAL_CONFIG.REDIS_HOST),
      port: configService.get<number>(GLOBAL_CONFIG.REDIS_PORT),
      tls: configService.get<boolean>(GLOBAL_CONFIG.REDIS_USE_TLS),
    },
    disableOfflineQueue: true,
    password: configService.get<string>(GLOBAL_CONFIG.REDIS_PASSWORD),
  };

  return {
    store: await redisStore(options),
    ttl: CONFIG.DEFAULT_CACHE_TTL,
  };
};
