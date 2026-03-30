import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model } from 'mongoose';

import {
  FcmNotificationLog,
  FcmNotificationLogDocument,
  FcmNotificationStatus,
} from '../schemas';

export interface CreateLogDto {
  sendTo: string;
  pumpuangName?: string | null;
  status: FcmNotificationStatus;
  reason: string;
  errorMessage?: string | null;
}

export interface FindLogsFilter {
  status?: FcmNotificationStatus;
  sendTo?: string;
  from?: string;
  to?: string;
}

@Injectable()
export class FcmNotificationLogRepository {
  constructor(
    @InjectModel(FcmNotificationLog.name)
    private readonly logModel: Model<FcmNotificationLogDocument>,
  ) {}

  async create(dto: CreateLogDto): Promise<FcmNotificationLogDocument> {
    return this.logModel.create({
      sendTo: dto.sendTo,
      pumpuangName: dto.pumpuangName ?? null,
      status: dto.status,
      reason: dto.reason,
      errorMessage: dto.errorMessage ?? null,
    });
  }

  async findPaginated(
    filter: FindLogsFilter,
    page: number,
    limit: number,
  ): Promise<{ data: FcmNotificationLogDocument[]; total: number }> {
    const query: FilterQuery<FcmNotificationLogDocument> = {};

    if (filter.status) {
      query.status = filter.status;
    }

    if (filter.sendTo) {
      query.sendTo = { $regex: filter.sendTo, $options: 'i' };
    }

    if (filter.from || filter.to) {
      query.createdAt = {};
      if (filter.from) query.createdAt.$gte = new Date(filter.from);
      if (filter.to) query.createdAt.$lte = new Date(filter.to);
    }

    const [data, total] = await Promise.all([
      this.logModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.logModel.countDocuments(query),
    ]);

    return { data: data as FcmNotificationLogDocument[], total };
  }

}
