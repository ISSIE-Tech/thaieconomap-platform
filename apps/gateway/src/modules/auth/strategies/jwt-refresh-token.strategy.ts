import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ErrorException } from '../../../common/exceptions';
import { UserDocument } from '../../../modules/users/schemas';
import { UsersService } from '../../../modules/users/users.service';
import { CODES, globalConfig } from '../../../shared/constants';
import { ITokenPayload } from '../../../shared/interfaces';
import { verifySha256Hash } from '../../../shared/utils';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(globalConfig.JWT_REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: ITokenPayload): Promise<UserDocument> {
    const user = await this.usersService.findById(payload.sub);

    if (!user?.refreshToken) {
      throw new ErrorException(CODES.AGW_002);
    }

    const isRefreshTokenMatch = await verifySha256Hash(
      request.body?.refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenMatch) {
      throw new ErrorException(CODES.AGW_002);
    }

    return user;
  }
}
