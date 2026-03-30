import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Pumpuang, PumpuangSchema } from '../pumpuangs/schemas';
import { UsersModule } from '../users/users.module';
import { NotificationsController } from './notifications.controller';
import { DeviceTokenRepository, FcmNotificationLogRepository } from './repositories';
import { DeviceToken, DeviceTokenSchema, FcmNotificationLog, FcmNotificationLogSchema } from './schemas';
import { FcmNotificationLogService, FcmService, NotificationService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeviceToken.name, schema: DeviceTokenSchema },
      { name: FcmNotificationLog.name, schema: FcmNotificationLogSchema },
      { name: Pumpuang.name, schema: PumpuangSchema },
    ]),
    UsersModule,
  ],
  controllers: [NotificationsController],
  providers: [FcmService, NotificationService, DeviceTokenRepository, FcmNotificationLogRepository, FcmNotificationLogService],
  exports: [FcmService, NotificationService, DeviceTokenRepository, FcmNotificationLogService],
})
export class NotificationsModule {}
