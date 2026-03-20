import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PumpuangStatus } from '@thaieconomap/contracts';
import mongoose, { HydratedDocument } from 'mongoose';

import { User, UserDocument } from '../../../modules/users/schemas';
import { COLLECTION_NAME } from '../../../shared/constants';
import { IsFavorite } from '../../../shared/utils';

import { PendingPumpuang } from './pending-pumpuang.schema';

export type PumpuangDocument = HydratedDocument<Pumpuang> & IsFavorite;

@Schema({
  collection: COLLECTION_NAME.pumpuangs,
  versionKey: false,
  timestamps: true,
})
export class Pumpuang extends PendingPumpuang {
  @Prop({
    required: true,
    default: Date.now,
  })
  approvedAt: Date;

  @Prop({
    default: PumpuangStatus.INACTIVE,
    enum: PumpuangStatus,
  })
  status: PumpuangStatus;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  approvedBy: UserDocument;

  @Prop({
    required: true,
    default: Date.now,
  })
  lastModifiedAt: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  lastModifiedBy: UserDocument;

  @Prop({
    default: null,
  })
  refreshToken?: string;
}

export const PumpuangSchema = SchemaFactory.createForClass(Pumpuang);
