import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ExternalModule } from '../externals/external.module';
import { MinioClientModule } from '../minio-client';
import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ApiKeyStrategy, JwtAccessTokenStrategy, JwtRefreshTokenStrategy } from './strategies';

@Module({
  imports: [UsersModule, JwtModule, ExternalModule, PassportModule, MinioClientModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy, ApiKeyStrategy],
})
export class AuthModule {}
