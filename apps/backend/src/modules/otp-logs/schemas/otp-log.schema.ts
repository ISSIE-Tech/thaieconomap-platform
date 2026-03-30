import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { COLLECTION_NAME } from '../../../shared/constants';

export type OtpLogDocument = HydratedDocument<OtpLog>;

export enum OtpAction {
  REQUEST = 'request',
  VERIFY = 'verify',
}

export enum OtpLogStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

@Schema({
  collection: COLLECTION_NAME.otpLogs,
  versionKey: false,
  timestamps: true,
})
export class OtpLog {
  @Prop({ required: true, index: true })
  phoneNumber: string;

  @Prop({ required: true, index: true })
  pumpuangId: string;

  @Prop({ default: null })
  pumpuangName: string | null;

  @Prop({ required: true, enum: OtpAction })
  action: OtpAction;

  @Prop({ required: true, enum: OtpLogStatus })
  status: OtpLogStatus;

  @Prop({ default: null })
  refno: string | null;

  @Prop({ default: null })
  errorMessage: string | null;
}

export const OtpLogSchema = SchemaFactory.createForClass(OtpLog);

OtpLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
