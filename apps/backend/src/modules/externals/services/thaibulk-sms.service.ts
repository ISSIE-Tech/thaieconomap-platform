import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Span } from 'nestjs-otel';
import { firstValueFrom } from 'rxjs';

import { ErrorException } from '../../../common/exceptions';
import { CODES, GLOBAL_CONFIG, THAIBULK_SMS } from '../../../shared/constants';
import { IRequestOtpResponse, IVerifyOtpResponse } from '../../../shared/interfaces';
import { getSpanName } from '../../../shared/utils';

@Injectable()
export class ThaiBulkSmsService {
  private thaiBulkSmsAppKey: string;
  private thaiBulkSmsAppSecret: string;
  private thaiBulkSmsApiUrl: string;
  private thaiBulkUrl: Record<string, string>;
  private readonly logger: Logger = new Logger(ThaiBulkSmsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.thaiBulkSmsAppKey = this.configService.get<string>(GLOBAL_CONFIG.THAIBULKSMS_APP_KEY);
    this.thaiBulkSmsAppSecret = this.configService.get<string>(
      GLOBAL_CONFIG.THAIBULKSMS_APP_SECRET,
    );
    this.thaiBulkSmsApiUrl = this.configService.get<string>(GLOBAL_CONFIG.THAIBULKSMS_API_URL);
    this.thaiBulkUrl = {
      request: this.thaiBulkSmsApiUrl + THAIBULK_SMS.request,
      verify: this.thaiBulkSmsApiUrl + THAIBULK_SMS.verify,
    };
  }

  @Span('Request OTP')
  async requestOtp(phoneNumber: string): Promise<IRequestOtpResponse> {
    this.logger.debug(`{${ThaiBulkSmsService.name}-[${getSpanName()}]} (called)`);

    try {
      const response = await firstValueFrom(
        this.httpService.post<IRequestOtpResponse>(this.thaiBulkUrl.request, {
          msisdn: phoneNumber.replace(/^0/, '66'),
          key: this.thaiBulkSmsAppKey,
          secret: this.thaiBulkSmsAppSecret,
        }),
      );

      return response.data;
    } catch (_err) {
      throw new ErrorException(CODES.TEC_075);
    }
  }

  @Span('Verify OTP')
  async verifyOtp(token: string, pin: string): Promise<IVerifyOtpResponse> {
    this.logger.debug(`{${ThaiBulkSmsService.name}-[${getSpanName()}]} (called)`);

    try {
      const response = await firstValueFrom(
        this.httpService.post<IVerifyOtpResponse>(this.thaiBulkUrl.verify, {
          token,
          pin,
          key: this.thaiBulkSmsAppKey,
          secret: this.thaiBulkSmsAppSecret,
        }),
      );

      return response.data;
    } catch (_err) {
      throw new ErrorException(CODES.TEC_075);
    }
  }
}
