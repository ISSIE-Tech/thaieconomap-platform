import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { EntityRepository } from '../../../shared/database';
import { ConditionOption, ConditionOptionDocument } from '../schemas';

@Injectable()
export class ConditionOptionsRepository extends EntityRepository<ConditionOptionDocument> {
  constructor(
    @InjectModel(ConditionOption.name)
    private conditionOption: Model<ConditionOptionDocument>,
  ) {
    super(conditionOption);
  }

  @Span('Find Condition Options')
  async find(
    conditionOptionFilterQuery: FilterQuery<ConditionOptionDocument>,
    projection?: ProjectionType<ConditionOptionDocument>,
    options?: QueryOptions,
  ): Promise<ConditionOptionDocument[]> {
    return this.conditionOption
      .find(conditionOptionFilterQuery, projection, options)
      .populate('createdBy', '_id authId')
      .lean<ConditionOptionDocument[]>()
      .exec();
  }
}
