import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExternalModule } from '../externals/external.module';
import { MapModule } from '../map/map.module';
import { MinioClientModule } from '../minio-client/minio-client.module';

import { FavoriteRepository, UsersRepository } from './repositories';
import { Favorite, FavoriteSchema } from './schemas/favorite.schema';
import { User, UserSchema } from './schemas/user.schema';
import { FavoriteService } from './services';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
    MinioClientModule,
    ExternalModule,
    MapModule,
  ],
  providers: [UsersService, FavoriteService, UsersRepository, FavoriteRepository],
  controllers: [UsersController],
  exports: [UsersService, FavoriteService, UsersRepository, FavoriteRepository],
})
export class UsersModule {}
