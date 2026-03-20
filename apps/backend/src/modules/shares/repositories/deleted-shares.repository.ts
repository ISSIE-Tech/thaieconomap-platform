import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { EntityRepository } from '../../../shared/database';
import { IPaginationQuery, IPaginationResponse } from '../../../shared/interfaces';
import { DeletedShare, DeletedShareDocument } from '../schemas';

@Injectable()
export class DeletedSharesRepository extends EntityRepository<DeletedShareDocument> {
  private readonly districtTarget: string = 'district';
  private readonly districtFieldSelector: string =
    'provinceName provinceId districtName districtId _id';

  private readonly optionTarget: string = 'types shipping condition';
  private readonly optionFieldSelector: string = 'name';

  private readonly createrTarget: string = 'createdBy';
  private readonly createrFieldSelector: string = 'authId _id';

  constructor(
    @InjectModel(DeletedShare.name)
    private deletedShareModel: Model<DeletedShareDocument>,
  ) {
    super(deletedShareModel);
  }

  @Span('Find Deleted Share')
  async find(
    deletedShareFilterQuery: FilterQuery<DeletedShareDocument>,
    projection?: ProjectionType<DeletedShareDocument>,
    options?: QueryOptions,
  ): Promise<DeletedShareDocument[]> {
    return this.deletedShareModel
      .find(deletedShareFilterQuery, projection, options)
      .populate(this.optionTarget, this.optionFieldSelector)
      .populate(this.districtTarget, this.districtFieldSelector)
      .populate(this.createrTarget, this.createrFieldSelector)
      .lean<DeletedShareDocument[]>()
      .exec();
  }

  @Span('Find Deleted Share By Id')
  async findById(
    deletedShareId: string,
    projection?: ProjectionType<DeletedShareDocument>,
    options?: QueryOptions,
  ): Promise<DeletedShareDocument> {
    return this.deletedShareModel
      .findById(deletedShareId, projection, options)
      .populate(this.optionTarget, this.optionFieldSelector)
      .populate(this.districtTarget, this.districtFieldSelector)
      .populate(this.createrTarget, this.createrFieldSelector)
      .lean<DeletedShareDocument>()
      .exec();
  }

  @Span('Find Deleted Share With Pagination')
  async findWithPagination(
    query: IPaginationQuery<DeletedShareDocument>,
    patternSearchProperties?: string[],
    projection?: ProjectionType<DeletedShareDocument>,
    populate: string[] = [],
  ): Promise<IPaginationResponse<DeletedShareDocument>> {
    populate.push(this.districtTarget);
    populate.push(this.createrTarget);
    populate.push(...this.optionTarget.split(' '));

    return super.findWithPagination(query, patternSearchProperties, projection, populate);
  }
}
