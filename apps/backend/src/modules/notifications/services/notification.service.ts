import { Injectable } from '@nestjs/common';

import { DeviceTokenRepository } from '../repositories';

import { FcmService } from './fcm.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly fcmService: FcmService,
    private readonly deviceTokenRepository: DeviceTokenRepository,
  ) {}

  async sendToPumpuang(
    pumpuangId: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    const tokens = await this.deviceTokenRepository.findTokensByPumpuangId(pumpuangId);

    await this.fcmService.sendToMultiple(tokens, title, body, data);
  }

  async sendToTopic(
    topic: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    await this.fcmService.sendToTopic(topic, title, body, data);
  }
}
