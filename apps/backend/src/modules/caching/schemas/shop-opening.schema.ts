import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ShopOpeningTime } from './shop-opening-time.schema';

@Schema({
  _id: false,
  versionKey: false,
})
export class ShopOpening {
  @Prop({ required: true })
  day: string;

  @Prop({ required: true })
  enable: boolean;

  @Prop({
    required: true,
    type: [ShopOpeningTime],
  })
  hours: ShopOpeningTime[];
}

export const ShopOpeningSchema = SchemaFactory.createForClass(ShopOpening);
