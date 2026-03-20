import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { EntityRepository } from '../../../shared/database';
import { DeletedCommercial, DeletedCommercialDocument } from '../schemas';

@Injectable()
export class DeletedCommercialsRepository extends EntityRepository<DeletedCommercialDocument> {
  constructor(
    @InjectModel(DeletedCommercial.name)
    private readonly deletedCommercialModel: Model<DeletedCommercialDocument>,
  ) {
    super(deletedCommercialModel);
  }

  private basePopulation = ['district', 'createdBy', 'types'];

  @Span('Find Deleted Commercia By Id')
  async findById(
    id: string,
    projection: ProjectionType<DeletedCommercialDocument> = {},
    options?: QueryOptions<DeletedCommercialDocument>,
  ): Promise<DeletedCommercialDocument> {
    return this.deletedCommercialModel
      .findById(id, projection, options)
      .populate(this.basePopulation)
      .lean<DeletedCommercialDocument>()
      .exec();
  }
}
