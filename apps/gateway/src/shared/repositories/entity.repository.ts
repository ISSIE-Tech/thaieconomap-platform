import { Document, FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

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
    projection: Record<string, unknown> = {},
    options?: QueryOptions<T>,
  ): Promise<T> {
    return this.entityModel.findById(id, projection, options).lean<T>().exec();
  }

  async findOne(
    filterQuery: FilterQuery<T>,
    projection: Record<string, unknown> = {},
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

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<unknown>,
    options: QueryOptions<T> = {},
  ): Promise<T> {
    options['new'] = true;

    return this.entityModel.findOneAndUpdate(filterQuery, updateQuery, options).lean<T>().exec();
  }

  async deleteMany(filterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(filterQuery).lean().exec();

    return deleteResult.deletedCount >= 1;
  }
}
