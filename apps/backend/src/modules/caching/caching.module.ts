import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExternalModule } from '../externals/external.module';
import { UsersModule } from '../users/users.module';

import { CachingService } from './caching.service';
import { BaseRepository, ShopRepository } from './repositories';
import { Base, BaseSchema, Shop, ShopSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shop.name, schema: ShopSchema },
      { name: Base.name, schema: BaseSchema },
    ]),
    ExternalModule,
    UsersModule,
  ],
  providers: [CachingService, ShopRepository, BaseRepository],
})
export class CachingModule {}
