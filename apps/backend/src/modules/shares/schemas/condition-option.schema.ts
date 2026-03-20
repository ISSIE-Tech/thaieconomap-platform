import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { CONFIG } from '../../../config';
import { COLLECTION_NAME } from '../../../shared/constants';
import { User, UserDocument } from '../../users/schemas';

export type ConditionOptionDocument = HydratedDocument<ConditionOption>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAME.conditionOptions,
})
export class ConditionOption {
  @Prop({
    required: true,
    unique: true,
    length: CONFIG.MAX_INPUT_LENGTH,
  })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: UserDocument;
}

export const ConditionOptionSchema = SchemaFactory.createForClass(ConditionOption);
