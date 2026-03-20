import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';

import { AuthService } from './auth.service';
import { ApiKeyStrategy } from './strategies';

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [],
  providers: [ApiKeyStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
