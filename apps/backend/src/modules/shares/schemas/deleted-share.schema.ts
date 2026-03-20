import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { CONFIG } from '../../../config';
import { COLLECTION_NAME, ONE_MONTH_IN_MS } from '../../../shared/constants';
import { User, UserDocument } from '../../users/schemas';

import { Share } from './share.schema';

export type DeletedShareDocument = HydratedDocument<DeletedShare>;

@Schema({
  versionKey: false,
  timestamps: { createdAt: 'deletedAt' },
  collection: COLLECTION_NAME.deletedShares,
})
export class DeletedShare extends Share {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  deletedBy: UserDocument;

  @Prop({
    required: true,
    type: Date,
    default: Date.now,
    index: {
      expires: CONFIG.AUTO_DELETE_DURATION,
    },
  })
  deletedAutoDelete: Date;

  @Prop({
    required: true,
    type: Date,
    default: () => Date.now() + ONE_MONTH_IN_MS,
  })
  completelyDeletedAt: Date;
}

export const DeletedShareSchema = SchemaFactory.createForClass(DeletedShare);
