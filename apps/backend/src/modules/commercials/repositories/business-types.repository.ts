import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { EntityRepository } from '../../../shared/database';
import { BusinessType, BusinessTypeDocument } from '../schemas';

@Injectable()
export class BusinessTypesRepository extends EntityRepository<BusinessTypeDocument> {
  constructor(
    @InjectModel(BusinessType.name)
    private businessTypeModel: Model<BusinessTypeDocument>,
  ) {
    super(businessTypeModel);
  }

  @Span('Find Business Types')
  async find(
    businessTypeQuery: FilterQuery<BusinessTypeDocument>,
    projection?: ProjectionType<BusinessTypeDocument>,
    options?: QueryOptions,
  ): Promise<BusinessTypeDocument[]> {
    return this.businessTypeModel
      .find(businessTypeQuery, projection, options)
      .populate('createdBy', '_id authId')
      .lean<BusinessTypeDocument[]>()
      .exec();
  }
}
