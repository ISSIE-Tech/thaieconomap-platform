import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExternalModule } from '../externals/external.module';
import { UsersModule } from '../users/users.module';

import { CachingController } from './caching.controller';
import { CachingService } from './caching.service';
import { BaseRepository, ShopRepository, SyncLogRepository } from './repositories';
import { Base, BaseSchema, Shop, ShopSchema, SyncLog, SyncLogSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shop.name, schema: ShopSchema },
      { name: Base.name, schema: BaseSchema },
      { name: SyncLog.name, schema: SyncLogSchema },
    ]),
    ExternalModule,
    UsersModule,
  ],
  controllers: [CachingController],
  providers: [CachingService, ShopRepository, BaseRepository, SyncLogRepository],
})
export class CachingModule {}
