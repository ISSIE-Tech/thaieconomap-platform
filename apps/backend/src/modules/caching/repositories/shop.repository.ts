import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityRepository } from '../../../shared/database';
import { Shop, ShopDocument } from '../schemas';

@Injectable()
export class ShopRepository extends EntityRepository<ShopDocument> {
  constructor(@InjectModel(Shop.name) shopModel: Model<ShopDocument>) {
    super(shopModel);
  }
}
