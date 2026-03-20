import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { EntityRepository } from '../../../shared/database';
import { RestaurantType, RestaurantTypeDocument } from '../schemas';

@Injectable()
export class RestaurantTypesRepository extends EntityRepository<RestaurantTypeDocument> {
  constructor(
    @InjectModel(RestaurantType.name)
    private restaurantType: Model<RestaurantTypeDocument>,
  ) {
    super(restaurantType);
  }

  @Span('Find Restaurant Types')
  async find(
    restaurantTypeFilterQuery: FilterQuery<RestaurantTypeDocument>,
    projection?: ProjectionType<RestaurantTypeDocument>,
    options?: QueryOptions,
  ): Promise<RestaurantTypeDocument[]> {
    return this.restaurantType
      .find(restaurantTypeFilterQuery, projection, options)
      .populate('createdBy', '_id authId')
      .lean<RestaurantTypeDocument[]>()
      .exec();
  }
}
