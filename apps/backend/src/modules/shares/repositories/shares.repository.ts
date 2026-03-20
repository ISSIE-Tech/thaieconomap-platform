import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, PopulateOptions, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { EntityRepository } from '../../../shared/database';
import { IPaginationQuery, IPaginationResponse } from '../../../shared/interfaces';
import { Share, ShareDocument } from '../schemas';

@Injectable()
export class SharesRepository extends EntityRepository<ShareDocument> {
  private readonly districtTarget: string = 'district';
  private readonly districtFieldSelector: string =
    'provinceName provinceId districtName districtId _id';

  private readonly optionTarget: string = 'types shipping condition';
  private readonly optionFieldSelector: string = 'name';

  private readonly createrTarget: string = 'createdBy';
  private readonly createrFieldSelector: string = 'authId _id';

  constructor(@InjectModel(Share.name) private shareModel: Model<ShareDocument>) {
    super(shareModel);
  }

  @Span('Find Share')
  async find(
    shareFilterQuery: FilterQuery<ShareDocument>,
    projection?: ProjectionType<ShareDocument>,
    options?: QueryOptions,
    populate?: PopulateOptions,
  ): Promise<ShareDocument[]> {
    return this.shareModel
      .find(shareFilterQuery, projection, options)
      .populate(this.optionTarget, this.optionFieldSelector)
      .populate(this.districtTarget, this.districtFieldSelector)
      .populate(this.createrTarget, this.createrFieldSelector)
      .populate(populate)
      .sort({
        createdAt: -1,
      })
      .lean<ShareDocument[]>()
      .exec();
  }

  @Span('Find Share By Id')
  async findById(
    shareId: string,
    projection?: ProjectionType<ShareDocument>,
    options?: QueryOptions,
    populate?: PopulateOptions,
  ): Promise<ShareDocument> {
    return this.shareModel
      .findById(shareId, projection, options)
      .populate(this.optionTarget, this.optionFieldSelector)
      .populate(this.districtTarget, this.districtFieldSelector)
      .populate(this.createrTarget, this.createrFieldSelector)
      .populate(populate)
      .lean<ShareDocument>()
      .exec();
  }

  @Span('Find Share With Pagination')
  async findWithPagination(
    query: IPaginationQuery<ShareDocument>,
    patternSearchProperties?: string[],
    projection?: ProjectionType<ShareDocument>,
    populate: string[] = [],
  ): Promise<IPaginationResponse<ShareDocument>> {
    populate.push(this.districtTarget);
    populate.push(this.createrTarget);
    populate.push(...this.optionTarget.split(' '));

    return super.findWithPagination(query, patternSearchProperties, projection, populate);
  }
}
