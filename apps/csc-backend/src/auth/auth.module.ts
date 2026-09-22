import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';
import { JwtAccessTokenStrategy } from './jwt-access-token.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({}), HttpModule, UsersModule],
  providers: [AuthService, JwtAccessTokenStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
