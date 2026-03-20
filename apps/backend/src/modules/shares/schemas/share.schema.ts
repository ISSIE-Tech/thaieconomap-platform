import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ShareStatus , SubmissionStatus } from '@thaieconomap/contracts';
import mongoose, { HydratedDocument } from 'mongoose';

import { COLLECTION_NAME } from '../../../shared/constants';
import { IsFavorite } from '../../../shared/utils';
import { User, UserDocument } from '../../users/schemas';

import { PendingShare } from './pending-share.schema';

export type ShareDocument = HydratedDocument<Share> & IsFavorite;

@Schema({
  versionKey: false,
  _id: false,
})
class Request {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: UserDocument;

  @Prop({
    required: true,
    type: String,
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;
}

@Schema({
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAME.shares,
})
export class Share extends PendingShare {
  @Prop({
    type: String,
    required: true,
    enum: ShareStatus,
    default: ShareStatus.OPEN,
  })
  status: ShareStatus;

  @Prop({
    required: true,
    type: [Request],
  })
  requests: Request[];

  @Prop({ required: true, default: Date.now })
  approvedAt: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  approvedBy: UserDocument;

  @Prop({
    required: true,
    default: Date.now,
  })
  lastModifiedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  lastModifiedBy: UserDocument;
}

export const ShareSchema = SchemaFactory.createForClass(Share);
