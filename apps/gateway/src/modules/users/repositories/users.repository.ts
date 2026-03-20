import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, QueryOptions } from 'mongoose';

import { OauthProvider } from '../../../shared/enums';
import { EntityRepository } from '../../../shared/repositories';
import { User, UserDocument } from '../schemas';

@Injectable()
export class UsersRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    super(userModel);
  }

  async findOneWithOauth(
    filterQuery: FilterQuery<UserDocument>,
    projection: Record<string, unknown> = {},
    options?: QueryOptions<UserDocument>,
  ): Promise<UserDocument> {
    return this.userModel
      .findOne(filterQuery, projection, options)
      .populate({
        path: 'oauth',
        options: { limit: 1 },
      })
      .lean<UserDocument>()
      .exec();
  }

  async findUserByOauthSub(sub: string, oauthProvider: OauthProvider): Promise<UserDocument> {
    const results = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'oauths',
          localField: 'oauth',
          foreignField: '_id',
          as: 'oauth',
          pipeline: [
            { $project: { createdAt: 0, updatedAt: 0 } },
            {
              $match: {
                $and: [
                  { $expr: { $eq: ['$sub', sub] } },
                  { $expr: { $eq: ['$provider', oauthProvider] } },
                ],
              },
            },
          ],
        },
      },
      { $unwind: '$oauth' },
    ]);

    return results.pop();
  }
}
