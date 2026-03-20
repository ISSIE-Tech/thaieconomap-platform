import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { CONFIG } from '../../../config';
import { User } from '../../../modules/users/schemas';
import { COLLECTION_NAME } from '../../../shared/constants';

export type ProductTypeDocument = HydratedDocument<ProductType>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAME.productTypes,
})
export class ProductType {
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

export const ProductTypeSchema = SchemaFactory.createForClass(ProductType);
