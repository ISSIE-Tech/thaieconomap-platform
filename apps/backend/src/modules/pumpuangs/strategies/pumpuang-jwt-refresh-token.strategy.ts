import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ErrorException } from '../../../common/exceptions';
import { CODES, GLOBAL_CONFIG } from '../../../shared/constants';
import { ITokenPayload } from '../../../shared/interfaces';
import { verifySha256Hash } from '../../../shared/utils';
import { PumpuangDocument } from '../schemas';
import { PumpuangsService } from '../services';

@Injectable()
export class PumpuangJwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'pumpuang-jwt-refresh-token',
) {
  constructor(
    private readonly pumpuangsService: PumpuangsService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(GLOBAL_CONFIG.APP_JWT_REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: ITokenPayload): Promise<PumpuangDocument> {
    const pumpuang = await this.pumpuangsService.getOne({ _id: payload.sub });

    if (!pumpuang?.refreshToken) {
      throw new ErrorException(CODES.TEC_002);
    }

    const isRefreshTokenMatch = await verifySha256Hash(
      request.body?.refreshToken,
      pumpuang.refreshToken,
    );

    if (!isRefreshTokenMatch) {
      throw new ErrorException(CODES.TEC_002);
    }

    return pumpuang;
  }
}
