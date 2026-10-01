import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExternalModule } from '../externals/external.module';
import { UsersModule } from '../users/users.module';

import { CachingController } from './caching.controller';
import { CachingService } from './caching.service';
import { CscJobsController } from './csc-jobs.controller';
import { CscJobsService } from './csc-jobs.service';
import { BaseRepository, ShopRepository, SyncLogRepository } from './repositories';
import {
  Base,
  BaseSchema,
  CscJobCategory,
  CscJobCategorySchema,
  CscJobPost,
  CscJobPostSchema,
  Shop,
  ShopSchema,
  SyncLog,
  SyncLogSchema,
} from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shop.name, schema: ShopSchema },
      { name: Base.name, schema: BaseSchema },
      { name: SyncLog.name, schema: SyncLogSchema },
      { name: CscJobPost.name, schema: CscJobPostSchema },
      { name: CscJobCategory.name, schema: CscJobCategorySchema },
    ]),
    ExternalModule,
    UsersModule,
  ],
  controllers: [CachingController, CscJobsController],
  providers: [CachingService, CscJobsService, ShopRepository, BaseRepository, SyncLogRepository],
})
export class CachingModule {}
