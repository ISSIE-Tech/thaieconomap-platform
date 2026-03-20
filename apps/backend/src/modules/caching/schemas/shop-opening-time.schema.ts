import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  versionKey: false,
  _id: false,
})
export class ShopOpeningTime {
  @Prop({ required: true })
  open: number;

  @Prop({ required: true })
  close: number;
}

export const ShopOpeningTimeSchema = SchemaFactory.createForClass(ShopOpeningTime);
