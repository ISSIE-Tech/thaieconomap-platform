import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { JobSubmissionStatus } from './job-submission-status-enum';
import { JobPost } from 'src/job-posts/schemas/job-post.schema';

export type SubmissionDocument = HydratedDocument<Submission>;

@Schema({ timestamps: true })
export class Submission {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPost',
  })
  jobPost: JobPost;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  candidate: User;

  @Prop({ enum: JobSubmissionStatus, default: JobSubmissionStatus.Pending })
  status: JobSubmissionStatus;

  @Prop()
  additionalInformation: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);

SubmissionSchema.index({ jobPost: 1, candidate: 1 }, { unique: true });
