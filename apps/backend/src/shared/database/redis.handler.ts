import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisStore, redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions, RedisClientType } from 'redis';

import { CONFIG } from '../../config';
import { GLOBAL_CONFIG } from '../constants';

export const RedisFactory = async (
  configService: ConfigService,
): Promise<{ store: RedisStore; ttl: number }> => {
  const options = {
    socket: {
      host: configService.get<string>(GLOBAL_CONFIG.REDIS_HOST),
      port: configService.get<number>(GLOBAL_CONFIG.REDIS_PORT),
      tls: configService.get<boolean>(GLOBAL_CONFIG.REDIS_USE_TLS),
    },
    disableOfflineQueue: true,
    password: configService.get<string>(GLOBAL_CONFIG.REDIS_PASSWORD),
  };

  return {
    store: await getStore(options),
    ttl: CONFIG.DEFAULT_CACHE_TTL,
  };
};

const getStore = async (options: RedisClientOptions) => {
  const store = await redisStore(options);
  const redisClient = store.client;

  restartRedisService(redisClient);

  return store;
};

const restartRedisService = (redisClient: RedisClientType) => {
  const logger = new Logger('Redis');
  const restartRedisService = async () => {
    await redisClient.disconnect();
    await redisClient.connect();
  };

  redisClient.on('connect', () => logger.log('redis.connection.connected'));

  redisClient.on('ready', () => logger.log('redis.connection.ready'));

  redisClient.on('error', error => {
    logger.error('redis.connection.error');

    if (!error.code) {
      setTimeout(restartRedisService, CONFIG.REDIS_RECONECT_INTERVAL);
    }
  });
};
