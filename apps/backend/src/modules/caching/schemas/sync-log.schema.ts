import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { COLLECTION_NAME } from '../../../shared/constants';

export type SyncLogDocument = HydratedDocument<SyncLog>;

export enum SyncTrigger {
  CRON = 'cron',
  MANUAL = 'manual',
}

export enum SyncSource {
  TAMSANG = 'tamsang',
  CSC = 'csc',
}

export enum SyncStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

@Schema({
  collection: COLLECTION_NAME.syncLogs,
  versionKey: false,
  timestamps: true,
})
export class SyncLog {
  // rows written before csc jobs were cached have no source and are tamsang syncs
  @Prop({ enum: SyncSource, default: SyncSource.TAMSANG })
  source: SyncSource;

  @Prop({ required: true, enum: SyncTrigger })
  trigger: SyncTrigger;

  // display name of the admin who pressed the button, null for the cron
  @Prop({ default: null })
  triggeredBy: string | null;

  @Prop({ required: true, enum: SyncStatus })
  status: SyncStatus;

  // shops returned by tamsang-tamsong vs shops kept after validation
  @Prop({ default: 0 })
  shopsReceived: number;

  @Prop({ default: 0 })
  shopsSaved: number;

  @Prop({ default: 0 })
  basesSaved: number;

  // csc job syncs: posts listed on the map vs posts whose detail was fetched
  @Prop({ default: 0 })
  jobsReceived: number;

  @Prop({ default: 0 })
  jobsSaved: number;

  @Prop({ default: 0 })
  jobCategoriesSaved: number;

  @Prop({ required: true })
  durationMs: number;

  @Prop({ default: null })
  errorMessage: string | null;
}

export const SyncLogSchema = SchemaFactory.createForClass(SyncLog);

SyncLogSchema.index({ createdAt: -1 });
