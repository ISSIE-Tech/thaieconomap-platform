import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  versionKey: false,
  _id: false,
})
export class ShopDisplayOpeningTime {
  @Prop({ required: true })
  open: string;

  @Prop({ required: true })
  close: string;
}

export const ShopDisplayOpeningTimeSchema = SchemaFactory.createForClass(ShopDisplayOpeningTime);
