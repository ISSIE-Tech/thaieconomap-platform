import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { EntityRepository } from '../../../shared/database';
import { PendingCommercial, PendingCommercialDocument } from '../schemas';

@Injectable()
export class PendingCommercialsRepository extends EntityRepository<PendingCommercialDocument> {
  constructor(
    @InjectModel(PendingCommercial.name)
    private readonly pendingCommercialModel: Model<PendingCommercialDocument>,
  ) {
    super(pendingCommercialModel);
  }

  private basePopulation = ['district', 'createdBy', 'types'];

  @Span('Find Pending Commercial By Id')
  async findById(
    id: string,
    projection: ProjectionType<PendingCommercialDocument> = {},
    options?: QueryOptions<PendingCommercialDocument>,
  ): Promise<PendingCommercialDocument> {
    return this.pendingCommercialModel
      .findById(id, projection, options)
      .populate(this.basePopulation)
      .lean<PendingCommercialDocument>()
      .exec();
  }
}
