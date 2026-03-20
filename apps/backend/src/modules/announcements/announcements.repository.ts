import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { AggregateOptions, FilterQuery, Model, PipelineStage, ProjectionType } from 'mongoose';
import { Span } from 'nestjs-otel';

import { COLLECTION_NAME } from '../../shared/constants';
import { EntityRepository } from '../../shared/database';

import { Announcement, AnnouncementDocument } from './schemas';

export interface IAnnouncementsOptions {
  date: Date;
}

@Injectable()
export class AnnouncementsRepository extends EntityRepository<AnnouncementDocument> {
  private readonly areaFieldSelector: string = '_id provinceName districtName';
  private readonly populateTarget: Record<string, string> = {
    districts: 'districts',
  };

  constructor(
    @InjectModel(Announcement.name)
    private announcementModel: Model<AnnouncementDocument>,
  ) {
    super(announcementModel);
  }

  @Span('Find Announcements')
  async find(
    announcementFilterQuery: FilterQuery<AnnouncementDocument>,
    projection: ProjectionType<AnnouncementDocument> = {},
  ): Promise<AnnouncementDocument[]> {
    return this.announcementModel
      .find(announcementFilterQuery, projection)
      .populate(this.populateTarget.districts, this.areaFieldSelector)
      .lean<AnnouncementDocument[]>({ virtuals: true })
      .exec();
  }

  @Span('Find Announcements By ID')
  async findById(
    announcementId: string,
    projection: ProjectionType<AnnouncementDocument> = {},
  ): Promise<AnnouncementDocument> {
    return this.announcementModel
      .findById(announcementId, projection)
      .populate(this.populateTarget.districts, this.areaFieldSelector)
      .lean<AnnouncementDocument>({ virtuals: true })
      .exec();
  }

  @Span('Find Announcements By Filters')
  async findAnnouncementsByFilters(
    filterQuery: FilterQuery<AnnouncementDocument>,
    projection?: ProjectionType<AnnouncementDocument>,
    options?: AggregateOptions,
  ): Promise<AnnouncementDocument[]> {
    const { provinceId, date, ...filters } = filterQuery;
    const query = {
      ...filters,
    };

    if (date) {
      query.startAt = { $lte: date };
      query.endAt = { $gte: date };
    }

    const pipeline: PipelineStage[] = [
      {
        $match: query,
      },
      {
        $lookup: {
          from: COLLECTION_NAME.districts,
          localField: this.populateTarget.districts,
          foreignField: '_id',
          as: this.populateTarget.districts,
        },
      },
    ];

    if (provinceId) {
      pipeline.push({
        $match: { 'districts.provinceId': Number(provinceId) },
      });
    }

    if (projection) {
      pipeline.push({
        $project: projection as Record<string, number>,
      });
    }

    // Note: legacy code find by area name
    // const areaSearchField = ['districtName', 'provinceName'];
    // const areaFilters = {
    //   $or: areaSearchField.map(field => ({
    //     [field]: new RegExp(provinceId, 'i'),
    //   })),
    // };

    return this.announcementModel.aggregate(pipeline, options).exec();
  }
}
