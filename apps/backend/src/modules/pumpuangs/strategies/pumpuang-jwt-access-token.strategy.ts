import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { ErrorException } from '../../../common/exceptions';
import { CODES, GLOBAL_CONFIG } from '../../../shared/constants';
import { ITokenPayload } from '../../../shared/interfaces';
import { PumpuangDocument } from '../schemas';
import { PumpuangsService } from '../services';

@Injectable()
export class PumpuangJwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'pumpuang-jwt-access-token',
) {
  constructor(
    private readonly pumpuangsService: PumpuangsService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(GLOBAL_CONFIG.APP_JWT_ACCESS_TOKEN_SECRET),
    });
  }

  async validate(payload: ITokenPayload): Promise<PumpuangDocument> {
    const pumpuang = await this.pumpuangsService.getOne(
      { _id: payload.sub },
      {
        refreshToken: 0,
      },
      {
        populate: [
          {
            path: 'types',
            select: 'name _id',
          },
        ],
      },
    );

    if (!pumpuang) {
      throw new ErrorException(CODES.TEC_002);
    }

    return pumpuang;
  }
}
