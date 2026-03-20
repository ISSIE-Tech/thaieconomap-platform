import {
  AnyBulkWriteOperation,
  Document,
  FilterQuery,
  Model,
  MongooseBulkWriteOptions,
  MongooseUpdateQueryOptions,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateWriteOpResult,
  mongo,
} from 'mongoose';

import { ErrorException } from '../../common/exceptions';
import { CODES } from '../constants';
import { IPaginationQuery, IPaginationResponse } from '../interfaces';
import { spiltQueryAndPaginationOptions } from '../utils';

export class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async find(
    filterQuery: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    return this.entityModel.find(filterQuery, projection, options).lean<T[]>().exec();
  }

  async findById(
    id: string,
    projection: ProjectionType<T> = {},
    options?: QueryOptions<T>,
  ): Promise<T> {
    return this.entityModel.findById(id, projection, options).lean<T>().exec();
  }

  async findOne(
    filterQuery: FilterQuery<T>,
    projection: ProjectionType<T> = {},
    options?: QueryOptions<T>,
  ): Promise<T> {
    return this.entityModel.findOne(filterQuery, projection, options).lean<T>().exec();
  }

  async create(createEntityData: unknown): Promise<T> {
    return new this.entityModel(createEntityData).save();
  }

  async findByIdAndUpdate(
    id: string,
    updateQuery?: UpdateQuery<unknown>,
    options: QueryOptions<T> = { new: true },
  ): Promise<T> {
    return this.entityModel.findByIdAndUpdate(id, updateQuery, options).lean<T>().exec();
  }

  async findByIdAndDelete(id: string): Promise<T> {
    return this.entityModel.findByIdAndDelete(id).lean<T>().exec();
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>, options?: QueryOptions<T>): Promise<T> {
    return this.entityModel.findOneAndDelete(filterQuery, options).lean<T>().exec();
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<unknown>,
    options: QueryOptions<T> = { new: true },
  ): Promise<T> {
    return this.entityModel.findOneAndUpdate(filterQuery, updateQuery, options).lean<T>().exec();
  }

  async deleteMany(filterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(filterQuery).lean().exec();

    return deleteResult.deletedCount >= 1;
  }

  async insertMany(insertData: unknown[]): Promise<T[]> {
    return this.entityModel.insertMany(insertData);
  }

  async findWithPagination(
    query: IPaginationQuery<T>,
    patternSearchProperties?: string[],
    projection?: ProjectionType<T>,
    populate?: (string | PopulateOptions)[],
  ): Promise<IPaginationResponse<T>> {
    const { filterQuery, paginationOptions } = spiltQueryAndPaginationOptions(query);
    const { page, perPage, direction, sortedBy } = paginationOptions;
    const numberOfSkipItems = (page - 1) * perPage;
    const numberOfLimit = perPage;
    const count = await this.entityModel.countDocuments(filterQuery);
    const lastPage = Math.ceil(count / perPage);
    const prevPage = page - 1 <= 0 ? null : page - 1;
    const nextPage = page === lastPage ? null : page + 1;

    if (!count && page !== 1) {
      throw new ErrorException(CODES.TEC_030);
    }

    for (const property of patternSearchProperties) {
      const key = property as keyof typeof filterQuery;

      if (filterQuery[key])
        filterQuery[key] = {
          $regex: filterQuery[key],
          $options: 'i',
        };
    }

    const data = await this.entityModel
      .find(filterQuery, projection)
      .populate(populate)
      .skip(numberOfSkipItems)
      .limit(numberOfLimit)
      .sort({
        [sortedBy]: direction,
      })
      .lean<T[]>()
      .exec();

    return {
      metaData: {
        count,
        perPage,
        prevPage,
        currentPage: page,
        nextPage,
        lastPage,
      },
      data,
    };
  }

  async countDocuments(
    filterQuery: FilterQuery<T>,
    options?: Record<string, string>,
  ): Promise<number> {
    return this.entityModel.countDocuments(filterQuery, options);
  }

  async bulkWrite(
    writes: AnyBulkWriteOperation[],
    options?: MongooseBulkWriteOptions,
  ): Promise<mongo.BulkWriteResult> {
    return this.entityModel.bulkWrite(writes, options);
  }

  async updateMany(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.entityModel.updateMany(filterQuery, updateQuery, options);
  }
}
