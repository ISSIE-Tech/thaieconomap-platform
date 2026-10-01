import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { COLLECTION_NAME } from '../../../shared/constants';

export enum SiteContentKey {
  ABOUT = 'about',
  TERMS = 'terms',
  PRIVACY = 'privacy',
}

export type SiteContentStrings = Record<string, { th: string; en: string }>;

export type SiteContentDocument = HydratedDocument<SiteContent>;

@Schema({
  collection: COLLECTION_NAME.siteContents,
  versionKey: false,
  timestamps: true,
})
export class SiteContent {
  @Prop({ required: true, unique: true, enum: SiteContentKey })
  key: SiteContentKey;

  // An array, not a map: keys such as "hero.01" contain dots, which are unsafe as Mongo field names.
  @Prop({ type: [{ _id: false, key: String, th: String, en: String }], default: [] })
  entries: { key: string; th: string; en: string }[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  updatedBy: mongoose.Types.ObjectId;

  updatedAt?: Date;
}

export const SiteContentSchema = SchemaFactory.createForClass(SiteContent);
