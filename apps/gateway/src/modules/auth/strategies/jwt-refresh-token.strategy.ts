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
import { generateSha256Hash } from '../../../shared/utils';

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
    // matches the single legacy hash as well as any hash in the per-device array
    const user = await this.usersService.findOne({
      _id: payload.sub,
      refreshToken: generateSha256Hash(request.body?.refreshToken),
    });

    if (!user) {
      throw new ErrorException(CODES.AGW_002);
    }

    return user;
  }
}
