import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityRepository } from '../../../shared/database';
import { PendingPumpuang, PendingPumpuangDocument } from '../schemas';

@Injectable()
export class PendingPumpuangRepository extends EntityRepository<PendingPumpuangDocument> {
  constructor(
    @InjectModel(PendingPumpuang.name)
    private readonly pendingPumpuangModel: Model<PendingPumpuangDocument>,
  ) {
    super(pendingPumpuangModel);
  }
}
