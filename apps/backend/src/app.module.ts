import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, minutes } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { configuration } from './config';
import {
  AnnouncementsModule,
  AuthModule,
  CachingModule,
  CommercialsModule,
  MapModule,
  MinioClientModule,
  NotificationsModule,
  OtpLogsModule,
  PumpuangsModule,
  SharesModule,
  UsersModule,
} from './modules';
import { AdditionalImageModule } from './modules/additional-image';
import { GLOBAL_CONFIG } from './shared/constants';
import { RedisFactory } from './shared/database';
import { RedisModule } from './shared/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configuration,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get(GLOBAL_CONFIG.MONGO_URI),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        limit: 60,
        ttl: minutes(1),
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => RedisFactory(configService),
      inject: [ConfigService],
    }),
    RedisModule,
    ScheduleModule.forRoot(),
    MapModule,
    CachingModule,
    CommercialsModule,
    UsersModule,
    MinioClientModule,
    SharesModule,
    AnnouncementsModule,
    AuthModule,
    AdditionalImageModule,
    PumpuangsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
