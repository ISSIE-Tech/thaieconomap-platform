import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Span } from 'nestjs-otel';

import { EntityRepository } from '../../shared/database';

import { District, DistrictDocument } from './schemas';

@Injectable()
export class DistrictsRepository extends EntityRepository<DistrictDocument> {
  constructor(
    @InjectModel(District.name)
    private readonly districtModel: Model<DistrictDocument>,
  ) {
    super(districtModel);
  }

  @Span('Find Province')
  async findProvince(): Promise<DistrictDocument[]> {
    return this.districtModel.aggregate([
      {
        $group: {
          _id: {
            provinceId: '$provinceId',
          },
          provinceId: {
            $first: '$provinceId',
          },
          provinceName: {
            $first: '$provinceName',
          },
        },
      },
      { $project: { _id: 0 } },
      { $sort: { provinceName: 1 } },
    ]);
  }
}
