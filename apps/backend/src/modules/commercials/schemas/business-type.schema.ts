import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { CONFIG } from '../../../config';
import { COLLECTION_NAME } from '../../../shared/constants';
import { User } from '../../users/schemas';

export type BusinessTypeDocument = HydratedDocument<BusinessType>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAME.businessTypes,
})
export class BusinessType {
  @Prop({
    required: true,
    unique: true,
    length: CONFIG.MAX_INPUT_LENGTH,
  })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: User;
}

export const BusinessTypeSchema = SchemaFactory.createForClass(BusinessType);
