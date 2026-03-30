import { Injectable } from '@nestjs/common';

import { FcmNotificationLogRepository, FindLogsFilter } from '../repositories';
import { FcmNotificationLogDocument, FcmNotificationStatus } from '../schemas';
import { DeviceTokenRepository } from '../repositories';

@Injectable()
export class FcmNotificationLogService {
  constructor(
    private readonly logRepository: FcmNotificationLogRepository,
    private readonly deviceTokenRepository: DeviceTokenRepository,
  ) {}

  async logSuccess(sendTo: string, reason: string): Promise<void> {
    await this.logRepository.create({
      sendTo,
      status: FcmNotificationStatus.SUCCESS,
      reason,
    });
  }

  async logFailure(sendTo: string, reason: string, errorMessage: string): Promise<void> {
    await this.logRepository.create({
      sendTo,
      status: FcmNotificationStatus.FAILURE,
      reason,
      errorMessage,
    });
  }

  async findLogs(
    filter: FindLogsFilter,
    page: number,
    limit: number,
  ): Promise<{ data: FcmNotificationLogDocument[]; total: number }> {
    return this.logRepository.findPaginated(filter, page, limit);
  }

  async getTokenCounts(pumpuangIds: string[]): Promise<Record<string, number>> {
    return this.deviceTokenRepository.countTokensByPumpuangIds(pumpuangIds);
  }
}
