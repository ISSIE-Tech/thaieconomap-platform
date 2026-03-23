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
    super({ header: 'api-key', prefix: '' }, false);

    this.apiKey = this.configService.get<string>(globalConfig.API_KEY);
    this.apiKeySecret = this.configService.get<string>(globalConfig.API_KEY_SECRET);
  }

  validate(apiKey: string): boolean {
    if (!this.verifyApiKey(apiKey)) {
      throw new ErrorException(CODES.AGW_02);
    }

    return true;
  }

  private verifyApiKey(apiKey: string): boolean {
    return verifyHmacSha256Hash(this.apiKey, this.apiKeySecret, apiKey);
  }
}
