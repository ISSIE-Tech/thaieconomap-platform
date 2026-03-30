import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { COLLECTION_NAME } from '../../../shared/constants';

export type FcmNotificationLogDocument = HydratedDocument<FcmNotificationLog>;

export enum FcmNotificationStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

@Schema({
  collection: COLLECTION_NAME.fcmNotificationLogs,
  versionKey: false,
  timestamps: true,
})
export class FcmNotificationLog {
  @Prop({ required: true, index: true })
  sendTo: string;

  @Prop({ default: null })
  pumpuangName: string | null;

  @Prop({ required: true, enum: FcmNotificationStatus })
  status: FcmNotificationStatus;

  @Prop({ required: true })
  reason: string;

  @Prop({ default: null })
  errorMessage: string | null;
}

export const FcmNotificationLogSchema = SchemaFactory.createForClass(FcmNotificationLog);

FcmNotificationLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
