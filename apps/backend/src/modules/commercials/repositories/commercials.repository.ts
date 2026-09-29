import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CommercialWorkingStatus } from '@thaieconomap/contracts';
import { Cache } from 'cache-manager';
import mongoose, {
  FilterQuery,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  Types,
} from 'mongoose';
import { Span } from 'nestjs-otel';

import { CONFIG } from '../../../config';
import { COLLECTION_NAME } from '../../../shared/constants';
import { EntityRepository } from '../../../shared/database';
import { getCurrentMiniutesPassSinceMidnight } from '../../../shared/utils';
import { BusinessType, Commercial, CommercialDocument } from '../schemas';

@Injectable()
export class CommercialsRepository extends EntityRepository<CommercialDocument> {
  private basePopolation = ['district', 'createdBy', 'types'];

  constructor(
    @InjectModel(Commercial.name)
    private readonly commercialModel: Model<CommercialDocument>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super(commercialModel);
  }

  @Span('Find Commercials By Id')
  async findById(
    id: string,
    projection: ProjectionType<CommercialDocument> = {},
    options?: QueryOptions<CommercialDocument>,
  ): Promise<CommercialDocument> {
    return this.commercialModel
      .findById(id, projection, options)
      .populate(this.basePopolation)
      .lean<CommercialDocument>()
      .exec();
  }

  @Span('Find Shop and Commercials')
  async findShopsAndCommercials(
    filterQuery: FilterQuery<CommercialDocument>,
    project?: PipelineStage.Project['$project'],
  ): Promise<CommercialDocument[]> {
    const pipeline = [];

    this.buildPipeline(pipeline, filterQuery);
    this.appendLookupStage(pipeline, COLLECTION_NAME.districts, 'district', '_id', 'district');

    this.appendUnwindStage(pipeline, '$district');

    this.appendLookupStage(
      pipeline,
      COLLECTION_NAME.businessTypes,
      'types',
      '_id',
      'businessTypeData',
    );
    this.appendLookupStage(
      pipeline,
      COLLECTION_NAME.restaurantTypes,
      'types',
      '_id',
      'restaurantTypeData',
    );
    this.addTypeField(pipeline);
    this.appendProjectStage(pipeline, {
      restaurantTypeData: 0,
      businessTypeData: 0,
    });

    this.appendUnionWithStage(pipeline, COLLECTION_NAME.shops, filterQuery);
    this.addWorkingStatus(pipeline);
    this.addIsNewlyOpened(pipeline);

    delete filterQuery.location;

    if (filterQuery.types) {
      filterQuery['types._id'] = {
        $in: filterQuery.types?.['$in'].map(type => new mongoose.Types.ObjectId(type)),
      };

      delete filterQuery.types;
    }

    this.appendMatchStage(pipeline, filterQuery);
    this.appendProjectStage(pipeline, project);

    return this.commercialModel.aggregate(pipeline);
  }

  @Span('Find Shop and Commercials By Id')
  async findShopsAndCommercialsById(
    id: string,
    project?: PipelineStage.Project['$project'],
  ): Promise<CommercialDocument> {
    return (await this.findShopsAndCommercials({ _id: new Types.ObjectId(id) }, project)).pop();
  }

  @Span('Add Type Field')
  private addTypeField(pipeline: PipelineStage[]): void {
    pipeline.push({
      $addFields: {
        types: {
          $cond: {
            if: { $eq: ['$typeRefPath', BusinessType.name] },
            then: '$businessTypeData',
            else: '$restaurantTypeData',
          },
        },
      },
    });
  }

  @Span('Build Pipeline')
  private buildPipeline(
    pipeline: PipelineStage[],
    filterQuery: FilterQuery<CommercialDocument>,
  ): void {
    if (filterQuery.location) {
      pipeline.push(filterQuery.location);
    }
  }

  @Span('Append Unwind Stage')
  private appendUnwindStage(pipeline: PipelineStage[], path: string): void {
    pipeline.push({ $unwind: path });
  }

  @Span('Append Lookup Stage')
  private appendLookupStage(
    pipeline: PipelineStage[],
    from: string,
    localField: string,
    foreignField: string,
    as: string,
  ): void {
    pipeline.push({
      $lookup: {
        from,
        localField,
        foreignField,
        as,
      },
    });
  }

  @Span('Append Project Stage')
  private appendProjectStage(
    pipeline: PipelineStage[],
    project: PipelineStage.Project['$project'],
  ): void {
    if (project) {
      pipeline.push({ $project: project });
    }
  }

  @Span('Append Match Stage')
  private appendMatchStage(
    pipeline: PipelineStage[],
    match: FilterQuery<CommercialDocument>,
  ): void {
    if (match) {
      pipeline.push({ $match: match });
    }
  }

  @Span('Append Union With Stage')
  private appendUnionWithStage(
    pipeline: PipelineStage[],
    coll: string,
    filterQuery: FilterQuery<CommercialDocument>,
  ): void {
    const unionPipeline = [];

    this.buildPipeline(unionPipeline, filterQuery);
    this.appendLookupStage(unionPipeline, COLLECTION_NAME.bases, 'base', '_id', 'base');
    this.appendUnwindStage(unionPipeline, '$base');

    pipeline.push({
      $unionWith: {
        coll,
        pipeline: unionPipeline,
      },
    });
  }

  @Span('Add Working Status')
  private addWorkingStatus(pipeline: PipelineStage[]): void {
    const time = new Date();
    const dayOfWeek = time.getDay();

    pipeline.push({
      $addFields: {
        workingStatus: {
          $let: {
            vars: {
              opening: { $arrayElemAt: ['$opening', dayOfWeek] },
              currentTime: getCurrentMiniutesPassSinceMidnight(time),
            },
            in: {
              $cond: {
                if: {
                  $eq: ['$$opening.enable', true],
                },
                then: this.buildOpeningHoursWorkingStatus(),
                else: CommercialWorkingStatus.CLOSED,
              },
            },
          },
        },
      },
    });
  }

  /**
   * A day can hold more than one opening window - an overnight window from the previous
   * day is carried in as its own entry - so the reduce keeps the best result it has
   * seen so far: OPEN beats NEAR_OPEN beats CLOSED.
   */
  @Span('Build Opening Hours Working Status')
  private buildOpeningHoursWorkingStatus(): Record<string, unknown> {
    return {
      $reduce: {
        input: '$$opening.hours',
        initialValue: CommercialWorkingStatus.CLOSED,
        in: {
          $switch: {
            branches: [
              {
                case: { $eq: ['$$value', CommercialWorkingStatus.OPEN] },
                then: CommercialWorkingStatus.OPEN,
              },
              {
                // Check if the current time is between the open and close time => OPEN
                case: {
                  $and: [
                    { $gte: ['$$currentTime', '$$this.open'] },
                    { $lte: ['$$currentTime', '$$this.close'] },
                  ],
                },
                then: CommercialWorkingStatus.OPEN,
              },
              {
                case: { $eq: ['$$value', CommercialWorkingStatus.NEAR_OPEN] },
                then: CommercialWorkingStatus.NEAR_OPEN,
              },
              {
                // Check if the current time is between the open time - NEAR_OPEN_DURATION_MINUTES and the open time => NEAR_OPEN
                case: {
                  $and: [
                    {
                      $gte: [
                        '$$currentTime',
                        { $subtract: ['$$this.open', CONFIG.NEAR_OPEN_DURATION_MINUTES] },
                      ],
                    },
                    { $lte: ['$$currentTime', '$$this.open'] },
                  ],
                },
                then: CommercialWorkingStatus.NEAR_OPEN,
              },
            ],
            default: CommercialWorkingStatus.CLOSED,
          },
        },
      },
    };
  }

  @Span('Add Is Newly Opened')
  private addIsNewlyOpened(pipeline: PipelineStage[]): void {
    pipeline.push({
      $addFields: {
        isNewlyOpened: {
          $let: {
            vars: {
              currentTime: new Date().getTime(),
              approvedAt: { $toLong: '$approvedAt' },
            },
            in: {
              $cond: {
                if: {
                  // Check if the current time is between the approved time and the approved time + NEWLY_OPENED_DURATION_MS => true
                  $and: [
                    { $gte: ['$$currentTime', '$$approvedAt'] },
                    {
                      $lte: [
                        '$$currentTime',
                        { $add: ['$$approvedAt', CONFIG.NEWLY_OPENED_DURATION_MS] },
                      ],
                    },
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
      },
    });
  }
}
