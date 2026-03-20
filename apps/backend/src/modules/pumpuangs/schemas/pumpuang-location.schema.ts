import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { CONFIG } from '../../../config';
import { COLLECTION_NAME, ONE_MONTH_IN_MS } from '../../../shared/constants';

export type PumpuangLocationDocument = HydratedDocument<PumpuangLocation>;

@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
class PumpuangHistory {
  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  trackedAt: Date;
}

@Schema({
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAME.pumpuangLocation,
})
export class PumpuangLocation {
  @Prop({
    required: true,
  })
  pumpuangId: string;

  @Prop({
    required: true,
    schema: PumpuangHistory,
  })
  history: PumpuangHistory[][];

  @Prop({
    required: true,
  })
  lastLocationSent: number;

  @Prop({
    type: Object,
    required: true,
  })
  current: {
    location: string;
    direction: number;
  };

  @Prop({
    type: [Object],
    required: true,
  })
  types: {
    _id: string;
    name: string;
  }[];

  @Prop({
    type: Date,
    index: {
      expires: CONFIG.AUTO_DELETE_DURATION,
    },
  })
  autoDelete?: Date;

  @Prop({
    type: Date,
    default: () => {
      const doc = this as PumpuangLocationDocument;

      return doc?.autoDelete ? Date.now() + ONE_MONTH_IN_MS : undefined;
    },
  })
  completelyDeleteAt?: Date;
}

export const PumpuangLocationSchema = SchemaFactory.createForClass(PumpuangLocation);
