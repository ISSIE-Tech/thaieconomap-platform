import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { OtpLogsController } from './otp-logs.controller';
import { OtpLogRepository } from './repositories';
import { OtpLog, OtpLogSchema } from './schemas';
import { OtpLogService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OtpLog.name, schema: OtpLogSchema }]),
    UsersModule,
  ],
  controllers: [OtpLogsController],
  providers: [OtpLogService, OtpLogRepository],
  exports: [OtpLogService],
})
export class OtpLogsModule {}
