import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard } from '@nestjs/throttler';

import { MinioClientModule } from '../../modules/minio-client/minio-client.module';
import { AdditionalImageModule } from '../additional-image';
import { CachingModule } from '../caching/caching.module';
import { MapModule } from '../map/map.module';
import { UsersModule } from '../users/users.module';

import {
  AllCommercialsController,
  BusinessTypesController,
  CommercialsController,
  DeletedCommercialsController,
  PendingCommercialsController,
  RestaurantTypesController,
} from './controllers';
import {
  BusinessTypesRepository,
  CommercialsRepository,
  DeletedCommercialsRepository,
  PendingCommercialsRepository,
  RestaurantTypesRepository,
} from './repositories';
import {
  BusinessType,
  BusinessTypeSchema,
  Commercial,
  CommercialSchema,
  DeletedCommercial,
  DeletedCommercialSchema,
  PendingCommercial,
  PendingCommercialSchema,
  RestaurantType,
  RestaurantTypeSchema,
} from './schemas';
import {
  AllCommercialsService,
  CommercialsService,
  DeletedCommercialsService,
  PendingCommercialsService,
} from './services';
import { BusinessTypesService } from './services/business-types.service';
import { RestaurantTypesService } from './services/restaurant-types.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Commercial.name, schema: CommercialSchema },
      { name: PendingCommercial.name, schema: PendingCommercialSchema },
      { name: DeletedCommercial.name, schema: DeletedCommercialSchema },
      { name: RestaurantType.name, schema: RestaurantTypeSchema },
      { name: BusinessType.name, schema: BusinessTypeSchema },
    ]),
    MinioClientModule,
    CachingModule,
    UsersModule,
    MapModule,
    AdditionalImageModule,
  ],
  controllers: [
    CommercialsController,
    PendingCommercialsController,
    DeletedCommercialsController,
    BusinessTypesController,
    RestaurantTypesController,
    AllCommercialsController,
  ],
  providers: [
    CommercialsService,
    PendingCommercialsService,
    DeletedCommercialsService,
    CommercialsRepository,
    PendingCommercialsRepository,
    DeletedCommercialsRepository,
    ThrottlerGuard,
    RestaurantTypesService,
    BusinessTypesService,
    RestaurantTypesRepository,
    AllCommercialsService,
    BusinessTypesRepository,
  ],
  exports: [
    CommercialsRepository,
    PendingCommercialsRepository,
    CommercialsService,
    PendingCommercialsService,
  ],
})
export class CommercialsModule {}
