import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

import { EntityRepository } from '../../../shared/database';
import { ProductType, ProductTypeDocument } from '../schemas';

@Injectable()
export class ProductTypesRepository extends EntityRepository<ProductTypeDocument> {
  constructor(
    @InjectModel(ProductType.name)
    private productType: Model<ProductTypeDocument>,
  ) {
    super(productType);
  }

  async find(
    productTypeFilterQuery: FilterQuery<ProductTypeDocument>,
    projection?: ProjectionType<ProductTypeDocument>,
    options?: QueryOptions,
  ): Promise<ProductTypeDocument[]> {
    return this.productType
      .find(productTypeFilterQuery, projection, options)
      .populate('createdBy', '_id authId')
      .lean<ProductTypeDocument[]>()
      .exec();
  }
}
