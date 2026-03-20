import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MinioClientModule } from '../minio-client';

import { OauthRepository, UsersRepository } from './repositories';
import { Oauth, OauthSchema, User, UserSchema } from './schemas';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Oauth.name,
        schema: OauthSchema,
      },
    ]),
    MinioClientModule,
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, OauthRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
