import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { CONFIG } from '../../../config';
import { User } from '../../../modules/users/schemas';
import { COLLECTION_NAME } from '../../../shared/constants';

export type RestaurantTypeDocument = HydratedDocument<RestaurantType>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAME.restaurantTypes,
})
export class RestaurantType {
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

export const RestaurantTypeSchema = SchemaFactory.createForClass(RestaurantType);
