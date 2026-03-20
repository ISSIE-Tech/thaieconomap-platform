import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { EntityRepository } from '../../../shared/database';
import { ShareType, ShareTypeDocument } from '../schemas';

@Injectable()
export class ShareTypesRepository extends EntityRepository<ShareTypeDocument> {
  constructor(
    @InjectModel(ShareType.name)
    private shareTypeModel: Model<ShareTypeDocument>,
  ) {
    super(shareTypeModel);
  }

  @Span('Find Share Types')
  async find(
    shareTypeFilterQuery: FilterQuery<ShareTypeDocument>,
    projection?: ProjectionType<ShareTypeDocument>,
    options?: QueryOptions,
  ): Promise<ShareTypeDocument[]> {
    return this.shareTypeModel
      .find(shareTypeFilterQuery, projection, options)
      .populate('createdBy', '_id authId')
      .lean<ShareTypeDocument[]>()
      .exec();
  }
}
