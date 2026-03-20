import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { CONFIG } from '../../../config';
import { User, UserDocument } from '../../../modules/users/schemas';
import { COLLECTION_NAME } from '../../../shared/constants';

export type ShippingOptionDocument = HydratedDocument<ShippingOption>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAME.shippingOptions,
})
export class ShippingOption {
  @Prop({
    required: true,
    unique: true,
    length: CONFIG.MAX_INPUT_LENGTH,
  })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: UserDocument;
}

export const ShippingOptionSchema = SchemaFactory.createForClass(ShippingOption);
