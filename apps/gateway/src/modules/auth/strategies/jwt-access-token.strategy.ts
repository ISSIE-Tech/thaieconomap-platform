import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { ErrorException } from '../../../common/exceptions';
import { UserDocument } from '../../../modules/users/schemas';
import { UsersService } from '../../../modules/users/users.service';
import { CODES, globalConfig } from '../../../shared/constants';
import { ITokenPayload } from '../../../shared/interfaces';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access-token') {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(globalConfig.JWT_ACCESS_TOKEN_SECRET),
    });
  }

  async validate(payload: ITokenPayload): Promise<UserDocument> {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new ErrorException(CODES.AGW_002);
    }

    return user;
  }
}
