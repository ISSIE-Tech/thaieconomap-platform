import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdditionalImageModule } from '../additional-image';
import { AuthModule } from '../auth/auth.module';
import { ExternalModule } from '../externals/external.module';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { OtpLogsModule } from '../otp-logs/otp-logs.module';
import { UsersModule } from '../users/users.module';

import {
  DeletedPumpuangsController,
  PendingPumpuangsController,
  ProductTypesController,
  PumpuangsController,
} from './controllers';
import { AllPumpuangsController } from './controllers/all-pumpuangs.controller';
import {
  DeletedPumpuangRepository,
  PendingPumpuangRepository,
  ProductTypesRepository,
  PumpuangLocationRepository,
  PumpuangRepository,
} from './repositories';
import {
  DeletedPumpuang,
  DeletedPumpuangSchema,
  PendingPumpuang,
  PendingPumpuangSchema,
  ProductType,
  ProductTypeSchema,
  Pumpuang,
  PumpuangLocation,
  PumpuangLocationSchema,
  PumpuangSchema,
} from './schemas';
import {
  AllPumpuangsService,
  DeletedPumpuangsService,
  PendingPumpuangsService,
  ProductTypesService,
  PumpuangsService,
} from './services';
import { LocationAnalyticsService } from './services/location-analytics.service';
import { PumpuangJwtAccessTokenStrategy, PumpuangJwtRefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pumpuang.name, schema: PumpuangSchema },
      { name: DeletedPumpuang.name, schema: DeletedPumpuangSchema },
      { name: PendingPumpuang.name, schema: PendingPumpuangSchema },
      { name: ProductType.name, schema: ProductTypeSchema },
      { name: PumpuangLocation.name, schema: PumpuangLocationSchema },
    ]),
    HttpModule.register({ timeout: 5000 }),
    UsersModule,
    AdditionalImageModule,
    MinioClientModule,
    ExternalModule,
    AuthModule,
    NotificationsModule,
    OtpLogsModule,
  ],
  controllers: [
    AllPumpuangsController,
    ProductTypesController,
    DeletedPumpuangsController,
    PumpuangsController,
    PendingPumpuangsController,
  ],
  providers: [
    AllPumpuangsService,
    ProductTypesRepository,
    ProductTypesService,
    DeletedPumpuangRepository,
    PendingPumpuangRepository,
    PumpuangRepository,
    DeletedPumpuangsService,
    PendingPumpuangsService,
    PumpuangsService,
    PumpuangJwtAccessTokenStrategy,
    PumpuangJwtRefreshTokenStrategy,
    PumpuangLocationRepository,
    LocationAnalyticsService,
  ],
})
export class PumpuangsModule {}
