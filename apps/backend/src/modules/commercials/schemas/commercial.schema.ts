import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { User, UserDocument } from '../../../modules/users/schemas';
import { COLLECTION_NAME } from '../../../shared/constants';
import { IsFavorite } from '../../../shared/utils';

import { PendingCommercial } from './pending-commercial.schema';

export type CommercialDocument = HydratedDocument<Commercial> & IsFavorite;

@Schema({
  collection: COLLECTION_NAME.commercials,
  versionKey: false,
  timestamps: true,
})
export class Commercial extends PendingCommercial {
  @Prop({
    required: true,
    default: Date.now,
  })
  approvedAt: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  approvedBy: UserDocument;

  @Prop({
    required: true,
    default: Date.now,
  })
  lastModifiedAt: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  lastModifiedBy: UserDocument;
}

export const CommercialSchema = SchemaFactory.createForClass(Commercial);
