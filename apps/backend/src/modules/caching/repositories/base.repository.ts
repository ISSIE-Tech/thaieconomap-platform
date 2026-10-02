import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityRepository } from '../../../shared/database';
import { Base, BaseDocument } from '../schemas';

@Injectable()
export class BaseRepository extends EntityRepository<BaseDocument> {
  constructor(@InjectModel(Base.name) baseModel: Model<BaseDocument>) {
    super(baseModel);
  }

  // Nearest orderable node whose service circle contains the point. Every node has its own
  // radius, so $geoNear only sorts by distance and the radius check runs per document after it.
  async findServing(latitude: number, longitude: number): Promise<Base | null> {
    const [base] = await this.entityModel.aggregate<Base>([
      {
        $geoNear: {
          key: 'location',
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'distance',
          spherical: true,
          query: {
            'botInfo.basicId': { $exists: true },
            serviceRadiusKm: { $gt: 0 },
            hidden: { $ne: true },
          },
        },
      },
      { $match: { $expr: { $lte: ['$distance', { $multiply: ['$serviceRadiusKm', 1000] }] } } },
      { $limit: 1 },
    ]);

    return base ?? null;
  }
}
