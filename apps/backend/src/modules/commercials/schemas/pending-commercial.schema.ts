import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CommercialCategory, SubmissionStatus } from '@thaieconomap/contracts';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { CONFIG } from '../../../config';
import { District, DistrictDocument } from '../../../modules/map/schemas';
import { User, UserDocument } from '../../../modules/users/schemas';
import { COLLECTION_NAME, ONE_MONTH_IN_MS } from '../../../shared/constants';
import {
  DisplayOpening,
  DisplayOpeningSchema,
  Location,
  LocationSchema,
  Opening,
  OpeningSchema,
} from '../../../shared/schemas';

import { BusinessType } from './business-type.schema';
import { RestaurantType } from './restaurant-type.schema';

export type PendingCommercialDocument = HydratedDocument<PendingCommercial>;

@Schema({
  collection: COLLECTION_NAME.pendingCommercials,
  versionKey: false,
  timestamps: true,
})
export class PendingCommercial {
  @Prop({
    required: true,
    length: CONFIG.MAX_INPUT_LENGTH,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    enum: CommercialCategory,
  })
  category: CommercialCategory;

  @Prop({
    required: true,
    type: LocationSchema,
    index: '2dsphere',
  })
  location: Location;

  @Prop({ required: true })
  imageUrl: string;

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
    type: mongoose.Schema.Types.ObjectId,
    ref: District.name,
  })
  district: DistrictDocument;

  @Prop({
    required: true,
    length: CONFIG.MAX_INPUT_LENGTH,
  })
  commercialOwner: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({
    default: '',
    length: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  moreInfo: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: UserDocument;

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
      const doc = this as PendingCommercialDocument;

      return doc?.rejectedAutoDelete ? Date.now() + ONE_MONTH_IN_MS : undefined;
    },
  })
  rejectedCompletelyDeleteAt?: Date;

  @Prop({
    default: [],
    type: [String],
  })
  additionalImageUrl?: string[];

  @Prop({
    required: true,
    type: String,
    enum: [BusinessType.name, RestaurantType.name],
  })
  typeRefPath: string;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, refPath: 'typeRefPath' }],
  })
  types: Types.ObjectId[];
}

export const PendingCommercialSchema = SchemaFactory.createForClass(PendingCommercial);
