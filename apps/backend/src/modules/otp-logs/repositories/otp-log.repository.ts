import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model } from 'mongoose';

import { OtpLog, OtpLogDocument, OtpAction, OtpLogStatus } from '../schemas';

export interface CreateOtpLogDto {
  phoneNumber: string;
  pumpuangId: string;
  pumpuangName?: string | null;
  action: OtpAction;
  status: OtpLogStatus;
  refno?: string | null;
  errorMessage?: string | null;
}

export interface FindOtpLogsFilter {
  action?: OtpAction;
  status?: OtpLogStatus;
  phoneNumber?: string;
  from?: string;
  to?: string;
}

@Injectable()
export class OtpLogRepository {
  constructor(
    @InjectModel(OtpLog.name)
    private readonly logModel: Model<OtpLogDocument>,
  ) {}

  async create(dto: CreateOtpLogDto): Promise<OtpLogDocument> {
    return this.logModel.create({
      phoneNumber: dto.phoneNumber,
      pumpuangId: dto.pumpuangId,
      pumpuangName: dto.pumpuangName ?? null,
      action: dto.action,
      status: dto.status,
      refno: dto.refno ?? null,
      errorMessage: dto.errorMessage ?? null,
    });
  }

  async findPaginated(
    filter: FindOtpLogsFilter,
    page: number,
    limit: number,
  ): Promise<{ data: OtpLogDocument[]; total: number }> {
    const query: FilterQuery<OtpLogDocument> = {};

    if (filter.action) {
      query.action = filter.action;
    }

    if (filter.status) {
      query.status = filter.status;
    }

    if (filter.phoneNumber) {
      query.phoneNumber = { $regex: filter.phoneNumber, $options: 'i' };
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

    return { data: data as OtpLogDocument[], total };
  }
}
