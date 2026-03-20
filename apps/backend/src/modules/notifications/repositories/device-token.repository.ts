import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { DeviceToken, DeviceTokenDocument } from '../schemas';

@Injectable()
export class DeviceTokenRepository {
  constructor(
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModel: Model<DeviceTokenDocument>,
  ) {}

  async upsertToken(
    pumpuangId: string,
    token: string,
    platform?: string,
  ): Promise<DeviceTokenDocument> {
    await this.deviceTokenModel.deleteMany({ token, pumpuangId: { $ne: pumpuangId } });

    return this.deviceTokenModel.findOneAndUpdate(
      { pumpuangId, token },
      { pumpuangId, token, ...(platform && { platform }) },
      { upsert: true, new: true },
    );
  }

  async removeToken(token: string): Promise<void> {
    await this.deviceTokenModel.deleteMany({ token });
  }

  async findTokensByPumpuangId(pumpuangId: string): Promise<string[]> {
    const docs = await this.deviceTokenModel.find({ pumpuangId }).lean();

    return docs.map(doc => doc.token);
  }

  async removeTokensByValues(tokens: string[]): Promise<void> {
    if (tokens.length === 0) return;
    await this.deviceTokenModel.deleteMany({ token: { $in: tokens } });
  }
}
