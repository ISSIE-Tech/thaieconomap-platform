import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard } from '@nestjs/throttler';

import { AdditionalImageModule } from '../additional-image';
import { MapModule } from '../map/map.module';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { UsersModule } from '../users/users.module';

import {
  ConditionOptionsController,
  DeletedSharesController,
  PendingSharesController,
  ShareTypesController,
  SharesController,
  ShippingOptionsController,
} from './controllers';
import { AllSharesController } from './controllers/all-shares.controller';
import {
  ConditionOptionsRepository,
  DeletedSharesRepository,
  PendingSharesRepository,
  ShareTypesRepository,
  SharesRepository,
  ShippingOptionsRepository,
} from './repositories';
import {
  ConditionOption,
  ConditionOptionSchema,
  DeletedShare,
  DeletedShareSchema,
  PendingShare,
  PendingShareSchema,
  Share,
  ShareSchema,
  ShareType,
  ShareTypeSchema,
  ShippingOption,
  ShippingOptionSchema,
} from './schemas';
import {
  AllSharesService,
  ConditionOptionsService,
  DeletedSharesService,
  PendingSharesService,
  ShareTypesService,
  SharesService,
  ShippingOptionsService,
} from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PendingShare.name, schema: PendingShareSchema },
      { name: Share.name, schema: ShareSchema },
      { name: DeletedShare.name, schema: DeletedShareSchema },
      { name: ShareType.name, schema: ShareTypeSchema },
      { name: ShippingOption.name, schema: ShippingOptionSchema },
      { name: ConditionOption.name, schema: ConditionOptionSchema },
    ]),
    MinioClientModule,
    MapModule,
    UsersModule,
    AdditionalImageModule,
  ],
  controllers: [
    PendingSharesController,
    SharesController,
    DeletedSharesController,
    ShareTypesController,
    ShippingOptionsController,
    ConditionOptionsController,
    AllSharesController,
  ],
  providers: [
    PendingSharesService,
    SharesService,
    DeletedSharesService,
    ShareTypesService,
    PendingSharesRepository,
    SharesRepository,
    DeletedSharesRepository,
    ShareTypesRepository,
    ShippingOptionsService,
    ShippingOptionsRepository,
    ConditionOptionsService,
    ConditionOptionsRepository,
    AllSharesService,
    ThrottlerGuard,
  ],
  exports: [
    SharesRepository,
    PendingSharesRepository,
    SharesService,
    PendingSharesService,
    AllSharesService,
  ],
})
export class SharesModule {}
