import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, SchemaTypes } from 'mongoose';

import { COLLECTION_NAME } from '../../../shared/constants';

// Copies of csc-backend's public job data. _id is the csc id, and mark/detail/data are served
// exactly as csc-backend sent them, so the frontend keeps its existing types.

export type CscJobPostDocument = HydratedDocument<CscJobPost>;

@Schema({ collection: COLLECTION_NAME.cscJobPosts, versionKey: false })
export class CscJobPost {
  @Prop({ type: String })
  _id: string;

  @Prop({ type: String, default: null, index: true })
  categoryId: string | null;

  // what GET /job-posts/map-mark returned for this post
  @Prop({ type: SchemaTypes.Mixed, required: true })
  mark: Record<string, unknown>;

  // what GET /job-posts/:id returned; image urls inside are presigned for 7 days
  @Prop({ type: SchemaTypes.Mixed, required: true })
  detail: Record<string, unknown>;

  // Set by an admin, never by the sync - the sync only $sets the fields above, so this survives it.
  @Prop({ default: false })
  hidden?: boolean;
}

export const CscJobPostSchema = SchemaFactory.createForClass(CscJobPost);

export type CscJobCategoryDocument = HydratedDocument<CscJobCategory>;

@Schema({ collection: COLLECTION_NAME.cscJobCategories, versionKey: false })
export class CscJobCategory {
  @Prop({ type: String })
  _id: string;

  // position in csc's list, which is the order the filter shows
  @Prop({ required: true })
  order: number;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  data: Record<string, unknown>;
}

export const CscJobCategorySchema = SchemaFactory.createForClass(CscJobCategory);
