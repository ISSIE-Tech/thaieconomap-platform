import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  versionKey: false,
  _id: false,
})
export class OpeningTime {
  @Prop({ required: true })
  open: number;

  @Prop({ required: true })
  close: number;
}

export const OpeningTimeSchema = SchemaFactory.createForClass(OpeningTime);
