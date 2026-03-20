import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityRepository } from '../../../shared/database';
import { Pumpuang, PumpuangDocument } from '../schemas';

@Injectable()
export class PumpuangRepository extends EntityRepository<PumpuangDocument> {
  constructor(@InjectModel(Pumpuang.name) private readonly pumpuangModel: Model<PumpuangDocument>) {
    super(pumpuangModel);
  }
}
