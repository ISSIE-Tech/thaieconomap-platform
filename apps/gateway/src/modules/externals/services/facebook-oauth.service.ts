import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosResponse, Method } from 'axios';
import { firstValueFrom } from 'rxjs';

import { ErrorException } from '../../../common/exceptions';
import { CODES, facebookPath, globalConfig } from '../../../shared/constants';
import { HttpMethod } from '../../../shared/enums';
import {
  IFacebookPayload,
  IFacebookProfile,
  IFacebookToken,
  IOauthProfile,
} from '../../../shared/interfaces';
import {
  generateRandomString,
  generateUrlWithQuery,
  prettyObjectString,
} from '../../../shared/utils';

import { AbstractBaseOauthService } from './abstract-base-oauth.service';

@Injectable()
export class FacebookOauthService extends AbstractBaseOauthService {
  private facebookBaseUrl: string;
  private facebookUrl: Record<string, string>;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private readonly logger: Logger = new Logger(FacebookOauthService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();

    this.facebookBaseUrl = this.configService.get<string>(globalConfig.FACEBOOK_LOGIN_BASE_URL);
    this.facebookUrl = {
      authorize: this.configService.get<string>(globalConfig.FACEBOOK_LOGIN_GENERATE_LINK_URL),
      accessToken: this.facebookBaseUrl + facebookPath.accessToken,
      me: this.facebookBaseUrl + facebookPath.me,
    };
    this.clientId = this.configService.get<string>(globalConfig.FACEBOOK_LOGIN_ID);
    this.clientSecret = this.configService.get<string>(globalConfig.FACEBOOK_LOGIN_SECRET);
    this.redirectUri = this.configService.get<string>(globalConfig.FACEBOOK_LOGIN_REDIRECT_URL);
  }

  getLoginLink(): string {
    this.logger.debug(`{${FacebookOauthService.name}-${this.getLoginLink.name}} (called)`);

    const queries = {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: generateRandomString(16),
      scope: 'email public_profile',
      response_type: 'code',
    };

    return generateUrlWithQuery(this.facebookUrl.authorize, queries);
  }

  async verifyAuthorizationCode(authorizationCode: string): Promise<IFacebookPayload> {
    this.logger.debug(
      `{${FacebookOauthService.name}-${this.verifyAuthorizationCode.name}} (called)\
      \n[param] ${prettyObjectString({
        hasAuthorizationCode: Boolean(authorizationCode),
      })}`,
    );

    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code: authorizationCode,
    });

    const response: IFacebookToken = (
      await this.fetchData(this.facebookUrl.accessToken, HttpMethod.POST, params)
    ).data;

    return {
      accessToken: response.access_token,
    };
  }

  async getProfile(payload: IFacebookPayload): Promise<IOauthProfile> {
    this.logger.debug(
      `{${FacebookOauthService.name}-${this.getProfile.name}} (called)\
      \n[param] ${prettyObjectString({
        hasPayload: Boolean(payload),
      })}`,
    );

    const fields = ['id', 'name', 'email', 'picture'];
    const params = new URLSearchParams({
      fields: fields.join(','),
      access_token: payload.accessToken,
    });

    const requestUrl = `${this.facebookUrl.me}?${params}`;
    const response: IFacebookProfile = (await this.fetchData(requestUrl, HttpMethod.GET, undefined))
      .data;

    return {
      oauthSub: response.id,
      name: response.name,
      email: response.email,
      profileImageUrl: response.picture.data.url,
    };
  }

  private async fetchData(
    url: string,
    method: Method,
    payload = undefined,
  ): Promise<AxiosResponse> {
    this.logger.debug(
      `{${FacebookOauthService.name}-${this.fetchData.name}} (called)\
      \n[param] ${prettyObjectString({
        url,
        method,
        hasPayload: Boolean(payload),
      })}`,
    );

    try {
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      return await firstValueFrom(
        this.httpService.request({ url, method, data: payload, ...config }),
      );
    } catch (error) {
      this.logger.error(error);

      throw new ErrorException(CODES.AGW_007);
    }
  }
}
