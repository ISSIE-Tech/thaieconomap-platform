import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { OpeningTime, OpeningTimeSchema } from './opening-time.schema';

@Schema({
  _id: false,
  versionKey: false,
})
export class Opening {
  @Prop({ required: true })
  day: string;

  @Prop({ required: true })
  enable: boolean;

  @Prop({
    required: true,
    type: [OpeningTimeSchema],
  })
  hours: OpeningTime[];
}

export const OpeningSchema = SchemaFactory.createForClass(Opening);
