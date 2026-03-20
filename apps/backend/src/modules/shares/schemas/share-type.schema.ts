import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { CONFIG } from '../../../config';
import { COLLECTION_NAME } from '../../../shared/constants';
import { User, UserDocument } from '../../users/schemas';

export type ShareTypeDocument = HydratedDocument<ShareType>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAME.shareTypes,
})
export class ShareType {
  @Prop({
    required: true,
    unique: true,
    length: CONFIG.MAX_INPUT_LENGTH,
  })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: UserDocument;
}

export const ShareTypeSchema = SchemaFactory.createForClass(ShareType);
