import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityRepository } from '../../../shared/database';
import { Base, BaseDocument } from '../schemas';

@Injectable()
export class BaseRepository extends EntityRepository<BaseDocument> {
  constructor(@InjectModel(Base.name) baseModel: Model<BaseDocument>) {
    super(baseModel);
  }
}
