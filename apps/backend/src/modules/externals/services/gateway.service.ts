import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosError, AxiosResponse, Method } from 'axios';
import { Span } from 'nestjs-otel';
import { firstValueFrom } from 'rxjs';

import { ErrorException } from '../../../common/exceptions';
import { CODES, GATEWAY_PATH, GLOBAL_CONFIG } from '../../../shared/constants';
import { IGateWayPrivilegeUserReponse, IGateWayResponse } from '../../../shared/interfaces';
import { generateHmacSha256Hash, getSpanName, prettyObjectString } from '../../../shared/utils';
import { UpdatePrivilegeUserDto } from '../../users/dto';

@Injectable()
export class GateWayService {
  private readonly gatewayApi: string;
  private readonly gatewayUrl;

  private readonly gateWayApiKey: string;
  private readonly gateWayApiSecret: string;

  private readonly logger: Logger = new Logger(GateWayService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.gateWayApiKey = this.configService.get<string>(GLOBAL_CONFIG.GATEWAY_API_KEY);
    this.gateWayApiSecret = this.configService.get<string>(GLOBAL_CONFIG.GATEWAY_API_SECRET);

    this.gatewayApi = this.configService.get<string>(GLOBAL_CONFIG.GATEWAY_API);
    this.gatewayUrl = {
      getAllPrivilegeUser: {
        url: this.gatewayApi + GATEWAY_PATH.getAllPrivilegeUser.path,
        method: GATEWAY_PATH.getAllPrivilegeUser.method,
      },
      updatePrivilegeUser: {
        url: this.gatewayApi + GATEWAY_PATH.updatePrivilege.path,
        method: GATEWAY_PATH.updatePrivilege.method,
      },
    };
  }

  @Span('get TEC Privilege User')
  async getPrivilegeUser(): Promise<IGateWayPrivilegeUserReponse[]> {
    this.logger.debug(`{${GateWayService.name}-[${getSpanName()}]} (called)`);

    const response = (
      await this.fetchData<IGateWayPrivilegeUserReponse[]>(
        this.gatewayUrl.getAllPrivilegeUser.url,
        this.gatewayUrl.getAllPrivilegeUser.method,
      )
    ).data;

    return response?.data;
  }

  @Span('update TEC Privilege User')
  async updatePrivilegeUser(
    shortId: string,
    updatePrivilegeUserDto: UpdatePrivilegeUserDto,
  ): Promise<IGateWayPrivilegeUserReponse> {
    this.logger.debug(`{${GateWayService.name}-[${getSpanName()}]} (called)`);

    const payload = {
      name: updatePrivilegeUserDto.name,
      phone: updatePrivilegeUserDto.phone,
      privilege: {
        role: updatePrivilegeUserDto.role,
        service: 'TEC',
      },
    };

    const response = (
      await this.fetchData<IGateWayPrivilegeUserReponse>(
        this.gatewayUrl.updatePrivilegeUser.url + `/${shortId}`,
        this.gatewayUrl.updatePrivilegeUser.method,
        payload,
      )
    ).data;

    return response?.data;
  }

  @Span('Fetch Data')
  private async fetchData<T>(
    url: string,
    method: Method,
    payload?,
  ): Promise<AxiosResponse<IGateWayResponse<T>>> {
    this.logger.debug(
      `{${GateWayService.name}-${this.fetchData.name}} (called)\
          \n[param] ${prettyObjectString({
            url,
            method,
            hasPayload: Boolean(payload),
          })}`,
    );

    try {
      const config = {
        headers: {
          'api-key': generateHmacSha256Hash(this.gateWayApiKey, this.gateWayApiSecret),
        },
      };

      return await firstValueFrom(
        this.httpService.request({ url, method, data: payload, ...config }),
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = (error as AxiosError).response;
        const data = (error as AxiosError).response?.data;

        this.logger.error(`${response?.status} ${response?.statusText}: ${JSON.stringify(data)}`);

        throw new ErrorException(
          CODES.TEC_004,
          undefined,
          data ? `Gateway: ${data['message']}` : undefined,
        );
      }

      throw new ErrorException(CODES.TEC_004);
    }
  }
}
