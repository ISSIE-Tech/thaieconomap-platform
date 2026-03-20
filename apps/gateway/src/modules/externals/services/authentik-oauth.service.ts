import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';

import { ErrorException } from '../../../common/exceptions';
import { CODES, globalConfig } from '../../../shared/constants';
import { UserRole } from '../../../shared/enums';
import { IAuthentikPayload, IAuthentikUserInfo, IOauthProfile } from '../../../shared/interfaces';
import { generateRandomString, generateUrlWithQuery, prettyObjectString } from '../../../shared/utils';

import { AbstractBaseOauthService } from './abstract-base-oauth.service';

@Injectable()
export class AuthentikOauthService extends AbstractBaseOauthService {
  private issuerUrl: string;
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private readonly determinedRoles: Map<string, UserRole> = new Map();
  private readonly logger: Logger = new Logger(AuthentikOauthService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();

    this.issuerUrl = this.configService.get<string>(globalConfig.AUTHENTIK_ISSUER_URL);

    // Authentik endpoints (authorize, token, userinfo) are at the base path /application/o/
    // e.g. issuer = https://auth.example.com/application/o/my-app/
    //      base   = https://auth.example.com/application/o
    const url = new URL(this.issuerUrl);
    const pathParts = url.pathname.replace(/\/+$/, '').split('/');

    pathParts.pop(); // remove the app slug
    url.pathname = pathParts.join('/');
    this.baseUrl = url.toString().replace(/\/+$/, '');

    this.clientId = this.configService.get<string>(globalConfig.AUTHENTIK_CLIENT_ID);
    this.clientSecret = this.configService.get<string>(globalConfig.AUTHENTIK_CLIENT_SECRET);
    this.redirectUri = this.configService.get<string>(globalConfig.AUTHENTIK_REDIRECT_URL);
  }

  getLoginLink(): string {
    this.logger.debug(`{${AuthentikOauthService.name}-${this.getLoginLink.name}} (called)`);

    const queries = {
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'openid profile email groups',
      state: generateRandomString(16),
    };

    return generateUrlWithQuery(`${this.baseUrl}/authorize/`, queries);
  }

  async verifyAuthorizationCode(authorizationCode: string): Promise<IAuthentikPayload> {
    this.logger.debug(
      `{${AuthentikOauthService.name}-${this.verifyAuthorizationCode.name}} (called)\
      \n[param] ${prettyObjectString({
        hasAuthorizationCode: Boolean(authorizationCode),
      })}`,
    );

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code: authorizationCode,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          url: `${this.baseUrl}/token/`,
          method: 'POST',
          data: params,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );

      return { accessToken: response.data.access_token };
    } catch (error) {
      this.logger.error(error);

      throw new ErrorException(CODES.AGW_006);
    }
  }

  async getProfile(payload: IAuthentikPayload): Promise<IOauthProfile> {
    this.logger.debug(
      `{${AuthentikOauthService.name}-${this.getProfile.name}} (called)\
      \n[param] ${prettyObjectString({
        hasPayload: Boolean(payload),
      })}`,
    );

    let userInfo: IAuthentikUserInfo;

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          url: `${this.baseUrl}/userinfo/`,
          method: 'GET',
          headers: { Authorization: `Bearer ${payload.accessToken}` },
        }),
      );

      userInfo = response.data;
    } catch (error) {
      this.logger.error(error);

      throw new ErrorException(CODES.AGW_006);
    }

    this.logger.verbose(
      `{${AuthentikOauthService.name}-${this.getProfile.name}} (userinfo)\
      \n${prettyObjectString({
        sub: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        groups: userInfo.groups,
      })}`,
    );

    // Determine role from OIDC groups
    const groups = userInfo.groups ?? [];

    let role: UserRole;

    if (groups.includes('thaieconomap-admin')) {
      role = UserRole.ADMIN;
    } else if (groups.includes('thaieconomap-manager')) {
      role = UserRole.MANAGER;
    } else {
      this.logger.warn(
        `{${AuthentikOauthService.name}} User ${userInfo.sub} has no valid group. Groups: ${groups.join(', ')}`,
      );

      throw new ErrorException(CODES.AGW_003);
    }

    // Store determined role for later retrieval by auth service
    this.determinedRoles.set(userInfo.sub, role);

    return {
      oauthSub: userInfo.sub,
      name: userInfo.name || userInfo.preferred_username || '',
      email: userInfo.email,
      profileImageUrl: userInfo.picture,
    };
  }

  getDeterminedRole(oauthSub: string): UserRole {
    const role = this.determinedRoles.get(oauthSub);

    this.determinedRoles.delete(oauthSub);

    return role ?? UserRole.MANAGER;
  }
}
