import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { CONFIG } from '../../../config';
import { User, UserDocument } from '../../../modules/users/schemas';
import { COLLECTION_NAME, ONE_MONTH_IN_MS } from '../../../shared/constants';

import { Pumpuang } from './pumpuang.schema';

export type DeletedPumpuangDocument = HydratedDocument<DeletedPumpuang>;

@Schema({
  collection: COLLECTION_NAME.deletedPumpuangs,
  versionKey: false,
  timestamps: { createdAt: 'deletedAt' },
})
export class DeletedPumpuang extends Pumpuang {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
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

export const DeletedPumpuangSchema = SchemaFactory.createForClass(DeletedPumpuang);
