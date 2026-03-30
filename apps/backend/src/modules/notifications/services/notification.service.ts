import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Pumpuang, PumpuangDocument } from '../../pumpuangs/schemas';
import { DeviceTokenRepository } from '../repositories';

import { FcmService } from './fcm.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly fcmService: FcmService,
    private readonly deviceTokenRepository: DeviceTokenRepository,
    @InjectModel(Pumpuang.name) private readonly pumpuangModel: Model<PumpuangDocument>,
  ) {}

  async sendToPumpuang(
    pumpuangId: string,
    title: string,
    body: string,
    data?: Record<string, string>,
    reason = 'notification',
    pumpuangName?: string | null,
  ): Promise<void> {
    const tokens = await this.deviceTokenRepository.findTokensByPumpuangId(pumpuangId);

    let name = pumpuangName;
    if (!name) {
      const pumpuang = await this.pumpuangModel.findById(pumpuangId, { owner: 1 }).lean();
      name = pumpuang?.owner ?? null;
    }

    await this.fcmService.sendToMultiple(tokens, title, body, data, reason, name);
  }

  async sendToTopic(
    topic: string,
    title: string,
    body: string,
    data?: Record<string, string>,
    reason = 'topic notification',
  ): Promise<void> {
    await this.fcmService.sendToTopic(topic, title, body, data, reason);
  }
}
