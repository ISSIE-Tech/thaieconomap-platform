import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { SubmissionStatus } from '@thaieconomap/contracts';
import mongoose, { HydratedDocument } from 'mongoose';

import { CONFIG } from '../../../config';
import { User, UserDocument } from '../../../modules/users/schemas';
import { COLLECTION_NAME, ONE_MONTH_IN_MS } from '../../../shared/constants';
import {
  DisplayOpening,
  DisplayOpeningSchema,
  Opening,
  OpeningSchema,
} from '../../../shared/schemas';

import { ProductType, ProductTypeDocument } from './product-type.schema';

export type PendingPumpuangDocument = HydratedDocument<PendingPumpuang>;

@Schema({
  collection: COLLECTION_NAME.pendingPumpuangs,
  versionKey: false,
  timestamps: true,
})
export class PendingPumpuang {
  @Prop({
    required: true,
    length: CONFIG.MAX_INPUT_LENGTH,
  })
  name: string;

  @Prop({
    required: true,
    length: CONFIG.MAX_INPUT_LENGTH,
  })
  licensePlate: string;

  @Prop({
    required: true,
    length: CONFIG.MAX_INPUT_LENGTH,
  })
  owner: string;

  @Prop({
    required: true,
    length: CONFIG.MAX_INPUT_LENGTH,
  })
  color: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({
    default: '',
    length: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  moreInfo: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({
    default: [],
    type: [String],
  })
  additionalImageUrl?: string[];

  @Prop({
    required: true,
    type: String,
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  submissionStatus: SubmissionStatus;

  @Prop({ length: CONFIG.MAX_TEXT_AREA_LENGTH })
  submissionMessage: string;

  @Prop({
    type: Date,
    index: {
      expires: CONFIG.AUTO_DELETE_DURATION,
    },
  })
  rejectedAutoDelete?: Date;

  @Prop({
    type: Date,
    default: () => {
      const doc = this as PendingPumpuangDocument;

      return doc?.rejectedAutoDelete ? Date.now() + ONE_MONTH_IN_MS : undefined;
    },
  })
  rejectedCompletelyDeleteAt?: Date;

  @Prop({
    required: true,
    type: [OpeningSchema],
  })
  opening: Opening[];

  @Prop({
    type: [DisplayOpeningSchema],
  })
  displayOpening: DisplayOpening[];

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: ProductType.name }],
  })
  types: ProductTypeDocument[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy?: UserDocument;
}

export const PendingPumpuangSchema = SchemaFactory.createForClass(PendingPumpuang);
