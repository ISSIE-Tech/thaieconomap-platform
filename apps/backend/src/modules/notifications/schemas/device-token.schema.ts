import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { COLLECTION_NAME } from '../../../shared/constants';

export type DeviceTokenDocument = HydratedDocument<DeviceToken>;

export enum DevicePlatform {
  IOS = 'ios',
  ANDROID = 'android',
}

@Schema({
  collection: COLLECTION_NAME.deviceTokens,
  versionKey: false,
  timestamps: true,
})
export class DeviceToken {
  @Prop({ required: true, index: true })
  pumpuangId: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ enum: DevicePlatform })
  platform?: DevicePlatform;
}

export const DeviceTokenSchema = SchemaFactory.createForClass(DeviceToken);
