import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  ShopDisplayOpeningTime,
  ShopDisplayOpeningTimeSchema,
} from './shop-display-opening-time.schema';

@Schema({
  _id: false,
  versionKey: false,
})
export class ShopDisplayOpening {
  @Prop({ required: true })
  days: string;

  @Prop({
    required: true,
    type: [ShopDisplayOpeningTimeSchema],
  })
  time: ShopDisplayOpeningTime[];
}

export const ShopDisplayOpeningSchema = SchemaFactory.createForClass(ShopDisplayOpening);
