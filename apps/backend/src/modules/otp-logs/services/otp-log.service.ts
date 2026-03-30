import { Injectable, Logger } from '@nestjs/common';

import { prettyObjectString } from '../../../shared/utils';
import { OtpLogRepository, FindOtpLogsFilter } from '../repositories';
import { OtpAction, OtpLogDocument, OtpLogStatus } from '../schemas';

@Injectable()
export class OtpLogService {
  private readonly logger = new Logger(OtpLogService.name);

  constructor(private readonly logRepository: OtpLogRepository) {}

  async logRequestSuccess(phoneNumber: string, pumpuangId: string, pumpuangName: string, refno: string): Promise<void> {
    const ctx = `${OtpLogService.name}-${this.logRequestSuccess.name}`;

    this.logger.log(
      `{${ctx}} (success)\
      \n[param] ${prettyObjectString({ phoneNumber, pumpuangId, pumpuangName, refno })}`,
    );

    await this.logRepository.create({
      phoneNumber,
      pumpuangId,
      pumpuangName,
      action: OtpAction.REQUEST,
      status: OtpLogStatus.SUCCESS,
      refno,
    });
  }

  async logRequestFailure(phoneNumber: string, pumpuangId: string, pumpuangName: string, errorMessage: string): Promise<void> {
    const ctx = `${OtpLogService.name}-${this.logRequestFailure.name}`;

    this.logger.error(
      `{${ctx}} (failed)\
      \n[param] ${prettyObjectString({ phoneNumber, pumpuangId, pumpuangName, errorMessage })}`,
    );

    await this.logRepository.create({
      phoneNumber,
      pumpuangId,
      pumpuangName,
      action: OtpAction.REQUEST,
      status: OtpLogStatus.FAILURE,
      errorMessage,
    });
  }

  async logVerifySuccess(phoneNumber: string, pumpuangId: string, pumpuangName: string): Promise<void> {
    const ctx = `${OtpLogService.name}-${this.logVerifySuccess.name}`;

    this.logger.log(
      `{${ctx}} (success)\
      \n[param] ${prettyObjectString({ phoneNumber, pumpuangId, pumpuangName })}`,
    );

    await this.logRepository.create({
      phoneNumber,
      pumpuangId,
      pumpuangName,
      action: OtpAction.VERIFY,
      status: OtpLogStatus.SUCCESS,
    });
  }

  async logVerifyFailure(phoneNumber: string, pumpuangId: string, pumpuangName: string, errorMessage: string): Promise<void> {
    const ctx = `${OtpLogService.name}-${this.logVerifyFailure.name}`;

    this.logger.error(
      `{${ctx}} (failed)\
      \n[param] ${prettyObjectString({ phoneNumber, pumpuangId, pumpuangName, errorMessage })}`,
    );

    await this.logRepository.create({
      phoneNumber,
      pumpuangId,
      pumpuangName,
      action: OtpAction.VERIFY,
      status: OtpLogStatus.FAILURE,
      errorMessage,
    });
  }

  async findLogs(
    filter: FindOtpLogsFilter,
    page: number,
    limit: number,
  ): Promise<{ data: OtpLogDocument[]; total: number }> {
    return this.logRepository.findPaginated(filter, page, limit);
  }
}
