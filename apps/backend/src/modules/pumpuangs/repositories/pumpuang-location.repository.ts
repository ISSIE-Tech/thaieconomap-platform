import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityRepository } from '../../../shared/database';
import { PumpuangLocation, PumpuangLocationDocument } from '../schemas';

@Injectable()
export class PumpuangLocationRepository extends EntityRepository<PumpuangLocationDocument> {
  constructor(
    @InjectModel(PumpuangLocation.name)
    private readonly pumpuangModel: Model<PumpuangLocationDocument>,
  ) {
    super(pumpuangModel);
  }
}
