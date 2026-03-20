import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, PipelineStage, Types } from 'mongoose';
import { Span } from 'nestjs-otel';

import { COLLECTION_NAME } from '../../../shared/constants';
import { EntityRepository } from '../../../shared/database';
import { Favorite, FavoriteDocument } from '../schemas';

@Injectable()
export class FavoriteRepository extends EntityRepository<FavoriteDocument> {
  constructor(@InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>) {
    super(favoriteModel);
  }

  @Span('Get Favorite By User Id')
  async getFavoriteByUserId(userId: string) {
    const pipeline: PipelineStage[] = [];

    this.appendMatchingStage(pipeline, { userId: new Types.ObjectId(userId) });
    this.appendProjectionStage(pipeline, {
      _id: 1,
      targetId: 1,
      type: 1,
      favoritedAt: '$createdAt',
    });
    this.appendFavoriteLookupStage(pipeline);
    this.appendFavoriteGroupingStage(pipeline);
    this.appendSortingStage(pipeline, '_id', 1); // sorting by group enum value

    return this.favoriteModel.aggregate(pipeline);
  }

  @Span('Append Favorite Lookup Stage')
  private appendFavoriteLookupStage(pipeline: PipelineStage[]): PipelineStage[] {
    const target = 'target';
    const targetId = '$targetId';
    const unwindStage = { $unwind: `$${target}` };
    const lookupPipeline = [];
    const unionCollection = [
      COLLECTION_NAME.shops,
      COLLECTION_NAME.commercials,
      COLLECTION_NAME.pumpuangs,
    ];

    unionCollection.forEach(collection => {
      this.appendUnionWithStage(lookupPipeline, collection);
    });

    this.appendProjectionStage(lookupPipeline, {
      id: 1,
      name: 1,
      address: 1,
      imageUrl: 1,
      createdAt: 1,
      updatedAt: 1,
      favoritedAt: 1,
    });

    this.appendMatchingStage(lookupPipeline, {
      $expr: {
        $eq: ['$_id', `$${targetId}`],
      },
    });

    lookupPipeline.push({ $limit: 1 });

    const lookupStage = {
      $lookup: {
        let: {
          targetId: `${targetId}`,
        },
        from: COLLECTION_NAME.shares,
        pipeline: lookupPipeline,
        as: target,
      },
    };

    pipeline.push(lookupStage, unwindStage);
    pipeline.push({
      $addFields: {
        'target.favoritedAt': '$favoritedAt',
      },
    });

    return pipeline;
  }

  @Span('Append Favorite Grouping Stage')
  private appendFavoriteGroupingStage(pipeline: PipelineStage[]): PipelineStage[] {
    const groupStage = {
      $group: {
        _id: '$type',
        targets: { $push: '$target' },
      },
    };

    pipeline.push(groupStage);

    return pipeline;
  }

  @Span('Append Union With Stage')
  private appendUnionWithStage(
    pipeline: PipelineStage[],
    unionCollection: string,
  ): PipelineStage[] {
    const unionStage: PipelineStage.UnionWith = {
      $unionWith: { coll: unionCollection },
    };

    pipeline.push(unionStage);

    return pipeline;
  }

  @Span('Append Sorting Stage')
  private appendSortingStage(
    pipeline: PipelineStage[],
    sortBy: string,
    direction: 1 | -1,
  ): PipelineStage[] {
    const sortingStage: PipelineStage.Sort = {
      $sort: { [sortBy]: direction },
    };

    pipeline.push(sortingStage);

    return pipeline;
  }

  @Span('Append Matching Stage')
  private appendMatchingStage(
    pipeline: PipelineStage[],
    matchBy: PipelineStage.Match['$match'],
  ): PipelineStage[] {
    const matchingStage: PipelineStage.Match = {
      $match: matchBy,
    };

    pipeline.push(matchingStage);

    return pipeline;
  }

  @Span('Append Projection Stage')
  private appendProjectionStage(
    pipeline: PipelineStage[],
    projectionFields: PipelineStage.Project['$project'],
  ): PipelineStage[] {
    const projectingStage: PipelineStage.Project = {
      $project: projectionFields,
    };

    pipeline.push(projectingStage);

    return pipeline;
  }
}
