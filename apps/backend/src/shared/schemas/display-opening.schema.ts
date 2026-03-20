import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { DisplayOpeningTime, DisplayOpeningTimeSchema } from './display-opening-time.schema';

@Schema({
  _id: false,
  versionKey: false,
})
export class DisplayOpening {
  @Prop({ required: true })
  days: string;

  @Prop({
    required: true,
    type: [DisplayOpeningTimeSchema],
  })
  time: DisplayOpeningTime[];
}

export const DisplayOpeningSchema = SchemaFactory.createForClass(DisplayOpening);
