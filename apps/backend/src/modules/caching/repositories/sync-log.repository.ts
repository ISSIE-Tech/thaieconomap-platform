import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityRepository } from '../../../shared/database';
import { SyncLog, SyncLogDocument, SyncSource } from '../schemas';

@Injectable()
export class SyncLogRepository extends EntityRepository<SyncLogDocument> {
  constructor(@InjectModel(SyncLog.name) syncLogModel: Model<SyncLogDocument>) {
    super(syncLogModel);
  }

  async findPaginated(
    page: number,
    limit: number,
    source = SyncSource.TAMSANG,
  ): Promise<{ data: SyncLogDocument[]; total: number }> {
    const filter =
      source === SyncSource.TAMSANG ? { source: { $ne: SyncSource.CSC } } : { source };

    const [data, total] = await Promise.all([
      this.entityModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<SyncLogDocument[]>(),
      this.entityModel.countDocuments(filter),
    ]);

    return { data, total };
  }
}
