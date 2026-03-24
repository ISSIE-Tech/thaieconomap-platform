import { ConfigService } from '@nestjs/config';

import KeyvRedis from '@keyv/redis';

import { CONFIG } from '../../config';
import { GLOBAL_CONFIG } from '../constants';

export const RedisFactory = async (configService: ConfigService) => {
  const host = configService.get<string>(GLOBAL_CONFIG.REDIS_HOST);
  const port = configService.get<number>(GLOBAL_CONFIG.REDIS_PORT);
  const password = configService.get<string>(GLOBAL_CONFIG.REDIS_PASSWORD);
  const useTls = configService.get<boolean>(GLOBAL_CONFIG.REDIS_USE_TLS);

  const protocol = useTls ? 'rediss' : 'redis';
  const authPart = password ? `:${password}@` : '';
  const url = `${protocol}://${authPart}${host}:${port}`;

  const store = new KeyvRedis(url);

  return {
    stores: [store],
    ttl: CONFIG.DEFAULT_CACHE_TTL,
  };
};
