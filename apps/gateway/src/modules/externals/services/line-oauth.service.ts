import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosResponse, Method } from 'axios';
import { firstValueFrom } from 'rxjs';

import { ErrorException } from '../../../common/exceptions';
import { CODES, globalConfig, linePath } from '../../../shared/constants';
import { HttpMethod, Service } from '../../../shared/enums';
import { ILinePayload, ILineProfile, ILineToken, IOauthProfile } from '../../../shared/interfaces';
import {
  generateRandomString,
  generateUrlWithQuery,
  prettyObjectString,
} from '../../../shared/utils';

import { AbstractBaseOauthService } from './abstract-base-oauth.service';

@Injectable()
export class LineOauthService extends AbstractBaseOauthService {
  private lineBaseUrl: string;
  private lineUrl: Record<string, string>;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: Map<string, string>;
  private readonly logger: Logger = new Logger(LineOauthService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();

    this.lineBaseUrl = this.configService.get<string>(globalConfig.LINE_LOGIN_BASE_URL);
    this.lineUrl = {
      authorize: this.configService.get<string>(globalConfig.LINE_LOGIN_GENERATE_LINK_URL),
      token: this.lineBaseUrl + linePath.token,
      verify: this.lineBaseUrl + linePath.verify,
    };
    this.clientId = this.configService.get<string>(globalConfig.LINE_LOGIN_ID);
    this.clientSecret = this.configService.get<string>(globalConfig.LINE_LOGIN_SECRET);
    this.redirectUri = new Map([
      [
        Service.TEC,
        this.configService.get<string>(globalConfig.LINE_LOGIN_THAIECONOMAP_REDIRECT_URL),
      ],
      [
        Service.TEC_ADMIN,
        this.configService.get<string>(globalConfig.LINE_LOGIN_THAIECONOMAP_ADMIN_REDIRECT_URL),
      ],
      [
        Service.TEC_V2,
        this.configService.get<string>(globalConfig.LINE_LOGIN_THAIECONOMAP_V2_REDIRECT_URL),
      ],
      [
        Service.DEV,
        this.configService.get<string>(globalConfig.LINE_LOGIN_THAIECONOMAP_DEV_REDIRECT_URL),
      ],
    ]);
  }

  getLoginLink(serviceName: Service): string {
    this.logger.debug(
      `{${LineOauthService.name}-${this.getLoginLink.name}} (called)\
      \n[param] ${prettyObjectString({
        serviceName,
      })}`,
    );

    const queries = {
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri.get(serviceName),
      scope: 'profile openid email',
      state: generateRandomString(16),
    };

    return generateUrlWithQuery(this.lineUrl.authorize, queries);
  }

  async verifyAuthorizationCode(
    authorizationCode: string,
    serviceName: Service,
  ): Promise<ILinePayload> {
    this.logger.debug(
      `{${LineOauthService.name}-${this.verifyAuthorizationCode.name}} (called)\
      \n[param] ${prettyObjectString({
        hasAuthorizationCode: Boolean(authorizationCode),
        serviceName,
      })}`,
    );

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri.get(serviceName),
      code: authorizationCode,
    });

    const response: ILineToken = (await this.fetchData(this.lineUrl.token, params, HttpMethod.POST))
      .data;

    return { idToken: response?.id_token };
  }

  async getProfile(payload: ILinePayload): Promise<IOauthProfile> {
    this.logger.debug(
      `{${LineOauthService.name}-${this.getProfile.name}} (called)\
      \n[param] ${prettyObjectString({
        hasPayload: Boolean(payload),
      })}`,
    );

    const body = {
      id_token: payload.idToken,
      client_id: this.configService.get<string>(globalConfig.LINE_LOGIN_ID),
    };

    const response: ILineProfile = (
      await this.fetchData(this.lineUrl.verify, body, HttpMethod.POST)
    ).data;

    return {
      oauthSub: response.sub,
      name: response.name,
      email: response.email,
      dateOfBirth: response.dateOfBirth,
      profileImageUrl: response.picture,
    };
  }

  private async fetchData(url: string, payload: unknown, method: Method): Promise<AxiosResponse> {
    this.logger.debug(
      `{${LineOauthService.name}-${this.fetchData.name}} (called)\
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

      throw new ErrorException(CODES.AGW_006);
    }
  }
}
