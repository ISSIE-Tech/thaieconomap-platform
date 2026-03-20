import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Span } from 'nestjs-otel';

import { GLOBAL_CONFIG } from '../../shared/constants';
import { ICredentials, ITokenPayload } from '../../shared/interfaces/token.interface';
import { prettyObjectString } from '../../shared/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger: Logger = new Logger(AuthService.name);

  @Span('Generate Credential')
  generateCredential(sub: string): ICredentials {
    this.logger.debug(
      `{${AuthService.name}-${this.generateCredential.name}} (called)\
      \n[param] ${prettyObjectString({
        sub,
      })}`,
    );

    return {
      accessToken: this.generateAccessToken(sub),
      refreshToken: this.generateRefreshToken(sub),
    };
  }

  @Span('Generate Access Token')
  private generateAccessToken(userId: string): string {
    this.logger.debug(`{${AuthService.name}-${this.generateAccessToken.name}} (called`);

    const payload: ITokenPayload = {
      sub: userId,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(GLOBAL_CONFIG.APP_JWT_ACCESS_TOKEN_SECRET),
      expiresIn: this.configService.get<string>(GLOBAL_CONFIG.APP_JWT_ACCESS_TOKEN_EXPIRATION_TIME),
    });
  }

  @Span('Generate Refresh Token')
  private generateRefreshToken(userId: string): string {
    this.logger.debug(`{${AuthService.name}-${this.generateRefreshToken.name}} (called)`);

    const payload: ITokenPayload = {
      sub: userId,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(GLOBAL_CONFIG.APP_JWT_REFRESH_TOKEN_SECRET),
      expiresIn: this.configService.get<string>(
        GLOBAL_CONFIG.APP_JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      ),
    });
  }
}
