import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DistrictDocument = HydratedDocument<District>;

@Schema()
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
