import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type JobCategoryDocument = HydratedDocument<JobCategory>;

@Schema({ timestamps: true, collection: 'job_categories' })
export class JobCategory {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  iconUrl: string;

  @Prop({ default: false })
  isMain: boolean;

  @Prop({ default: -1 })
  index: number;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}

export const JobCategorySchema = SchemaFactory.createForClass(JobCategory);
