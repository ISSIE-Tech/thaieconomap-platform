import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityRepository } from '../../../shared/database';
import { DeletedPumpuang, DeletedPumpuangDocument } from '../schemas';

@Injectable()
export class DeletedPumpuangRepository extends EntityRepository<DeletedPumpuangDocument> {
  constructor(
    @InjectModel(DeletedPumpuang.name)
    private readonly deletedPumpuangModel: Model<DeletedPumpuangDocument>,
  ) {
    super(deletedPumpuangModel);
  }
}
