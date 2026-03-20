import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { COLLECTION_NAME } from '../../../shared/constants';

export type DistrictDocument = HydratedDocument<District>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: COLLECTION_NAME.districts,
})
export class District {
  @Prop()
  provinceId: number;

  @Prop()
  provinceName: string;

  @Prop()
  districtId: number;

  @Prop()
  districtType: string;

  @Prop()
  districtName: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;
}

export const DistrictSchema = SchemaFactory.createForClass(District);
