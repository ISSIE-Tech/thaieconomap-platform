import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  versionKey: false,
  _id: false,
})
export class DisplayOpeningTime {
  @Prop({ required: true })
  open: string;

  @Prop({ required: true })
  close: string;
}

export const DisplayOpeningTimeSchema = SchemaFactory.createForClass(DisplayOpeningTime);
