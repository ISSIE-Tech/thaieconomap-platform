import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { createClient, RedisClientType } from 'redis';

import { CONFIG } from '../../config';
import { GLOBAL_CONFIG } from '../constants';

import { REDIS_CLIENT } from './redis.constants';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService): Promise<RedisClientType> => {
        const logger = new Logger('RedisModule');

        const client = createClient({
          socket: {
            host: configService.get<string>(GLOBAL_CONFIG.REDIS_HOST),
            port: configService.get<number>(GLOBAL_CONFIG.REDIS_PORT),
            tls: configService.get<boolean>(GLOBAL_CONFIG.REDIS_USE_TLS),
          },
          password: configService.get<string>(GLOBAL_CONFIG.REDIS_PASSWORD),
        }) as RedisClientType;

        client.on('connect', () => logger.log('redis.connection.connected'));
        client.on('ready', () => logger.log('redis.connection.ready'));
        client.on('error', (error) => {
          logger.error(`redis.connection.error: ${error.message}`);
          if (!error.code) {
            setTimeout(async () => {
              try {
                await client.disconnect();
                await client.connect();
              } catch (e) {
                logger.error(`redis.reconnect.failed: ${e.message}`);
              }
            }, CONFIG.REDIS_RECONECT_INTERVAL);
          }
        });

        await client.connect();

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
