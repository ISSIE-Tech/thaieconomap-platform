import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

import { ErrorException } from '../../../common/exceptions';
import { CODES, globalConfig } from '../../../shared/constants';
import { verifyHmacSha256Hash } from '../../../shared/utils';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
  private apiKey: string;
  private apiKeySecret: string;

  constructor(private readonly configService: ConfigService) {
    super({ header: 'api-key', prefix: '' }, true, async (apiKey, done) => {
      if (!this.validate(apiKey)) {
        return done(new ErrorException(CODES.AGW_02), false);
      }

      return done(null, true);
    });

    this.apiKey = this.configService.get<string>(globalConfig.API_KEY);
    this.apiKeySecret = this.configService.get<string>(globalConfig.API_KEY_SECRET);
  }

  validate(apiKey: string): boolean {
    return verifyHmacSha256Hash(this.apiKey, this.apiKeySecret, apiKey);
  }
}
