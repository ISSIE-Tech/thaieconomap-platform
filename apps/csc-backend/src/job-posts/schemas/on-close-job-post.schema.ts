import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OnCloseJobPostDocument = HydratedDocument<OnCloseJobPost>;

@Schema({
  collection: 'on_close_job_posts',
})
export class OnCloseJobPost {
  @Prop({
    type: Date,
    expires: 0,
  })
  closedAt: Date;
}

export const OnCloseJobPostSchema =
  SchemaFactory.createForClass(OnCloseJobPost);
