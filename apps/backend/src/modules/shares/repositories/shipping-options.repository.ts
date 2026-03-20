import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { EntityRepository } from '../../../shared/database';
import { ShippingOption, ShippingOptionDocument } from '../schemas';

@Injectable()
export class ShippingOptionsRepository extends EntityRepository<ShippingOptionDocument> {
  constructor(
    @InjectModel(ShippingOption.name)
    private shippingOption: Model<ShippingOptionDocument>,
  ) {
    super(shippingOption);
  }

  @Span('Find Shipping Options')
  async find(
    shippingOptionFilterQuery: FilterQuery<ShippingOptionDocument>,
    projection?: ProjectionType<ShippingOptionDocument>,
    options?: QueryOptions,
  ): Promise<ShippingOptionDocument[]> {
    return this.shippingOption
      .find(shippingOptionFilterQuery, projection, options)
      .populate('createdBy', '_id authId')
      .lean<ShippingOptionDocument[]>()
      .exec();
  }
}
