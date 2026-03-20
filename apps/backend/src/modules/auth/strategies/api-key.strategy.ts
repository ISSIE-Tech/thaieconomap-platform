import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Span } from 'nestjs-otel';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

import { ErrorException } from '../../../common/exceptions';
import { CODES, GLOBAL_CONFIG } from '../../../shared/constants';
import { verifyHmacSha256Hash } from '../../../shared/utils';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
  private apiKey: string;
  private apiKeySecret: string;

  constructor(private readonly configService: ConfigService) {
    super({ header: 'api-key', prefix: '' }, true, async (apiKey, done) => {
      if (!this.validate(apiKey)) {
        return done(new ErrorException(CODES.TEC_002), false);
      }

      return done(null, true);
    });

    this.apiKey = this.configService.get<string>(GLOBAL_CONFIG.API_KEY);
    this.apiKeySecret = this.configService.get<string>(GLOBAL_CONFIG.API_KEY_SECRET);
  }

  @Span('Validate API Key')
  validate(apiKey: string): boolean {
    return verifyHmacSha256Hash(this.apiKey, this.apiKeySecret, apiKey);
  }
}
