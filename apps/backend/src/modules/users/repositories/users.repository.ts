import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, PipelineStage, Types } from 'mongoose';
import { Span } from 'nestjs-otel';

import { COLLECTION_NAME } from '../../../shared/constants';
import { EntityRepository } from '../../../shared/database';
import { IHistory } from '../../../shared/interfaces';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  @Span('Get History By User Id')
  async getHistoryByUserId(id: string): Promise<IHistory[]> {
    const historyCollection = [
      COLLECTION_NAME.commercials,
      COLLECTION_NAME.jobs,
      COLLECTION_NAME.shares,
      COLLECTION_NAME.pendingCommercials,
      COLLECTION_NAME.pendingJobs,
      COLLECTION_NAME.pendingShares,
    ];

    const pipeline: PipelineStage[] = [{ $match: { _id: new Types.ObjectId(id) } }];

    this.appendHistoryLookupStage(historyCollection, pipeline);
    this.appendPrettierStage(historyCollection, pipeline);

    const resultArray = (await this.userModel.aggregate(pipeline)).pop();

    return resultArray.results;
  }

  @Span('Type Lookup Stage')
  private typeLookupTStage(pipeline: PipelineStage[]): PipelineStage[] {
    pipeline.push({
      $lookup: {
        let: {
          typeIds: '$types',
        },
        from: COLLECTION_NAME.shareTypes,
        as: 'types',
        pipeline: [
          { $unionWith: { coll: COLLECTION_NAME.restaurantTypes } },
          { $unionWith: { coll: COLLECTION_NAME.businessTypes } },
          {
            $project: {
              createdBy: 0,
              createdAt: 0,
              updatedAt: 0,
            },
          },
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$typeIds'],
              },
            },
          },
        ],
      },
    });

    return pipeline;
  }

  @Span('Share Option Lookup Stage')
  private shareOptionLookupStage(pipeline: PipelineStage[]): PipelineStage[] {
    const shareOptionCollection = new Map<string, string>([
      ['condition', COLLECTION_NAME.conditionOptions],
      ['shipping', COLLECTION_NAME.shippingOptions],
    ]);

    shareOptionCollection.forEach((collection, field) => {
      pipeline.push({
        $lookup: {
          from: collection,
          localField: field,
          foreignField: '_id',
          as: field,
          pipeline: [
            {
              $project: {
                createdBy: 0,
                createdAt: 0,
                updatedAt: 0,
              },
            },
          ],
        },
      });

      pipeline.push({
        $unwind: {
          path: `$${field}`,
          preserveNullAndEmptyArrays: true,
        },
      });
    });

    return pipeline;
  }

  @Span('Append History Lookup Stage')
  private appendHistoryLookupStage(collection: string[], pipeline: PipelineStage[]): void {
    collection.map(name => {
      const lookupsPipeline = [
        {
          $project: {
            typeRefPath: 0,
            approvedBy: 0,
            approvedAt: 0,
            lastModifiedBy: 0,
            rejectedAutoDelete: 0,
            rejectedCompletelyDeleteAt: 0,
          },
        },
        {
          $lookup: {
            from: COLLECTION_NAME.districts,
            localField: 'district',
            foreignField: '_id',
            as: 'district',
          },
        },
        { $unwind: '$district' },
      ];

      this.typeLookupTStage(lookupsPipeline);
      this.shareOptionLookupStage(lookupsPipeline);

      pipeline.push({
        $lookup: {
          from: name,
          localField: '_id',
          foreignField: 'createdBy',
          as: name,
          pipeline: [...lookupsPipeline, { $set: { entityType: name.split('_').pop() } }],
        },
      });
    });
  }

  @Span('Append Prettier Stage')
  private appendPrettierStage(collection: string[], pipeline: PipelineStage[]): void {
    const conCat = collection.map(name => `$${name}`);

    pipeline.push({
      $replaceRoot: {
        newRoot: {
          results: {
            $sortArray: {
              input: { $concatArrays: conCat },
              sortBy: { createdAt: -1 },
            },
          },
        },
      },
    });
  }
}
