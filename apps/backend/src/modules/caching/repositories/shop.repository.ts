import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model } from 'mongoose';

import { EntityRepository } from '../../../shared/database';
import { Shop, ShopDocument } from '../schemas';

@Injectable()
export class ShopRepository extends EntityRepository<ShopDocument> {
  constructor(@InjectModel(Shop.name) shopModel: Model<ShopDocument>) {
    super(shopModel);
  }

  async findPaginated(
    search: string | undefined,
    page: number,
    limit: number,
  ): Promise<{ data: ShopDocument[]; total: number }> {
    const query: FilterQuery<ShopDocument> = search
      ? { name: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
      : {};

    const [data, total] = await Promise.all([
      this.entityModel
        .find(query)
        .populate('base', 'name')
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<ShopDocument[]>(),
      this.entityModel.countDocuments(query),
    ]);

    return { data, total };
  }
}
