import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { EntityRepository } from '../../../shared/database';
import { IPaginationQuery, IPaginationResponse } from '../../../shared/interfaces';
import { PendingShare, PendingShareDocument } from '../schemas';

@Injectable()
export class PendingSharesRepository extends EntityRepository<PendingShareDocument> {
  private readonly districtTarget: string = 'district';
  private readonly districtFieldSelector: string =
    'provinceName provinceId districtName districtId _id';

  private readonly optionTarget: string = 'types shipping condition';
  private readonly optionFieldSelector: string = 'name';

  private readonly createrTarget: string = 'createdBy';
  private readonly createrFieldSelector: string = 'authId _id';

  constructor(
    @InjectModel(PendingShare.name)
    private pendingShareModel: Model<PendingShareDocument>,
  ) {
    super(pendingShareModel);
  }

  @Span('Find Pending Share')
  async find(
    pendingShareFilterQuery: FilterQuery<PendingShareDocument>,
    projection?: ProjectionType<PendingShareDocument>,
    options?: QueryOptions<PendingShareDocument>,
  ): Promise<PendingShareDocument[]> {
    return this.pendingShareModel
      .find(pendingShareFilterQuery, projection, options)
      .populate(this.optionTarget, this.optionFieldSelector)
      .populate(this.districtTarget, this.districtFieldSelector)
      .populate(this.createrTarget, this.createrFieldSelector)
      .lean<PendingShareDocument[]>()
      .exec();
  }

  @Span('Find Pending Share By Id')
  async findById(
    pendingShareId: string,
    projection?: ProjectionType<PendingShareDocument>,
    options?: QueryOptions<PendingShareDocument>,
  ): Promise<PendingShareDocument> {
    return this.pendingShareModel
      .findById(pendingShareId, projection, options)
      .populate(this.optionTarget, this.optionFieldSelector)
      .populate(this.districtTarget, this.districtFieldSelector)
      .populate(this.createrTarget)
      .lean<PendingShareDocument>()
      .exec();
  }

  @Span('Find Pending Share With Pagination')
  async findWithPagination(
    query: IPaginationQuery<PendingShareDocument>,
    patternSearchProperties?: string[],
    projection?: ProjectionType<PendingShareDocument>,
    populate: string[] = [],
  ): Promise<IPaginationResponse<PendingShareDocument>> {
    populate.push(this.districtTarget);
    populate.push(this.createrTarget);
    populate.push(...this.optionTarget.split(' '));

    return super.findWithPagination(query, patternSearchProperties, projection, populate);
  }
}
