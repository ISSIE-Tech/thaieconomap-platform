import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { GeoJsonType } from '../enums';

@Schema({
  _id: false,
  versionKey: false,
})
export class Location {
  @Prop({
    type: String,
    required: true,
    enum: GeoJsonType,
  })
  type: string;

  @Prop({
    type: [Number],
    required: true,
  })
  coordinates: number[] | number[][];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
