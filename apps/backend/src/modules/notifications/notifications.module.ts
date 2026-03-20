import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationsController } from './notifications.controller';
import { DeviceTokenRepository } from './repositories';
import { DeviceToken, DeviceTokenSchema } from './schemas';
import { FcmService, NotificationService } from './services';

@Module({
  imports: [MongooseModule.forFeature([{ name: DeviceToken.name, schema: DeviceTokenSchema }])],
  controllers: [NotificationsController],
  providers: [FcmService, NotificationService, DeviceTokenRepository],
  exports: [FcmService, NotificationService, DeviceTokenRepository],
})
export class NotificationsModule {}
