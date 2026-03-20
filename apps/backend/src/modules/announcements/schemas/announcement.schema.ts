import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';
import * as LeanVirtuals from 'mongoose-lean-virtuals';

import { CONFIG } from '../../../config';
import { District } from '../../../modules/map/schemas';
import { User } from '../../../modules/users/schemas';
import { COLLECTION_NAME } from '../../../shared/constants';

export type AnnouncementDocument = HydratedDocument<Announcement>;

export enum AnnouncementStatus {
  PENDING = 'PENDING',
  ANNOUNCED = 'ANNOUNCED',
  EXPIRED = 'EXPIRED',
}

@Schema({
  versionKey: false,
  timestamps: true,
  collection: COLLECTION_NAME.announcements,
})
export class Announcement {
  @Prop({
    required: true,
    maxlength: CONFIG.MAX_INPUT_LENGTH,
  })
  name: string;

  @Prop()
  pdfUrl: string;

  @Prop({
    required: true,
    maxlength: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  detail: string;

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: District.name,
      },
    ],
  })
  districts: District[];

  @Prop({ maxlength: CONFIG.MAX_TEXT_AREA_LENGTH })
  subDistricts: string;

  @Prop()
  startAt: Date;

  @Prop()
  endAt: Date;

  @Prop({
    required: true,
    maxlength: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  announcer: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: User;

  @Prop({
    required: true,
    type: Date,
    index: {
      expires: CONFIG.AUTO_DELETE_DURATION,
    },
  })
  expiredAutoDelete: Date;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);

AnnouncementSchema.set('id', false);
AnnouncementSchema.virtual('isAvailable').get(function () {
  const now = new Date();

  return now >= this.startAt && now < this.endAt;
});

AnnouncementSchema.virtual('status').get(function () {
  const now = new Date();

  if (now >= this.endAt) {
    return AnnouncementStatus.EXPIRED;
  }

  if (now < this.startAt) {
    return AnnouncementStatus.PENDING;
  }

  return AnnouncementStatus.ANNOUNCED;
});

AnnouncementSchema.plugin(LeanVirtuals.mongooseLeanVirtuals);
