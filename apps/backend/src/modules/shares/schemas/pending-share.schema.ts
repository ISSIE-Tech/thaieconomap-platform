import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { SubmissionStatus } from '@thaieconomap/contracts';
import mongoose, { HydratedDocument } from 'mongoose';

import { CONFIG } from '../../../config';
import { District, DistrictDocument } from '../../../modules/map/schemas';
import { COLLECTION_NAME, ONE_MONTH_IN_MS } from '../../../shared/constants';
import { Location, LocationSchema } from '../../../shared/schemas';
import { User, UserDocument } from '../../users/schemas';

import { ConditionOption, ConditionOptionDocument } from './condition-option.schema';
import { ShareType, ShareTypeDocument } from './share-type.schema';
import { ShippingOption, ShippingOptionDocument } from './shipping-option.schema';

export type PendingShareDocument = HydratedDocument<PendingShare>;

export class Contact {
  name: string;
  phoneNumber: string;
  email: string;
}

export class AmountWithUnit {
  amount: number;
  unit: string;
}

@Schema({
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAME.pendingShares,
})
export class PendingShare {
  @Prop({
    required: true,
    length: CONFIG.MAX_INPUT_LENGTH,
  })
  name: string;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: ShareType.name,
  })
  types: ShareTypeDocument[];

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
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: UserDocument;

  @Prop({
    default: '',
    length: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  address: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: District.name,
  })
  district: DistrictDocument;

  @Prop({
    default: '',
    length: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  detail: string;

  @Prop({ required: true })
  contact: Contact;

  @Prop({ required: true })
  amount: AmountWithUnit;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: ShippingOption.name,
  })
  shipping: ShippingOptionDocument;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: ConditionOption.name,
  })
  condition: ConditionOptionDocument;

  @Prop({
    default: '',
    length: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  moreDetail: string;

  @Prop({
    type: String,
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  submissionStatus: SubmissionStatus;

  @Prop({
    default: '',
    length: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
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
      const doc = this as PendingShareDocument;

      return doc?.rejectedAutoDelete ? Date.now() + ONE_MONTH_IN_MS : undefined;
    },
  })
  rejectedCompletelyDeletedAt?: Date;

  @Prop({
    type: [String],
    default: [],
  })
  additionalImageUrl?: string[];
}

export const PendingShareSchema = SchemaFactory.createForClass(PendingShare);
