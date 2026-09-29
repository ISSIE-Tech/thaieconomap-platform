import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityRepository } from '../../../shared/database';
import { SyncLog, SyncLogDocument } from '../schemas';

@Injectable()
export class SyncLogRepository extends EntityRepository<SyncLogDocument> {
  constructor(@InjectModel(SyncLog.name) syncLogModel: Model<SyncLogDocument>) {
    super(syncLogModel);
  }

  async findPaginated(page: number, limit: number): Promise<{ data: SyncLogDocument[]; total: number }> {
    const [data, total] = await Promise.all([
      this.entityModel
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<SyncLogDocument[]>(),
      this.entityModel.countDocuments(),
    ]);

    return { data, total };
  }
}
