import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { JobCategory } from './job-category.schema';
import { JobPostAcceptanceStatus, JobPostStatus } from './job-post-status.enum';
import { Applicants, ApplicantsSchema } from './applicants.schema';
import { User } from 'src/users/schemas/user.schema';
import {
  JobPostLocationSchema,
  JobPostLocation,
} from './job-post-location.schema';
import { JobPostSubmissionStatus } from './job-post-submission-status.enum';
import { JobPostWage, JobPostWageSchema } from './job-post-wage.schema';

export type JobPostDocument = HydratedDocument<JobPost>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  collection: 'job_posts',
})
export class JobPost {
  @Prop()
  title: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobCategory',
  })
  category: JobCategory;

  @Prop()
  description: string;

  // TODO MAKE it computable
  @Prop({ enum: JobPostStatus, default: JobPostStatus.Available })
  status: JobPostStatus;

  @Prop()
  rejectMessage: string;

  @Prop({
    enum: JobPostAcceptanceStatus,
    default: JobPostAcceptanceStatus.Available,
  })
  acceptanceStatus: JobPostAcceptanceStatus;

  @Prop({
    enum: JobPostSubmissionStatus,
    default: JobPostSubmissionStatus.Pending,
  })
  submissionStatus: JobPostSubmissionStatus;

  @Prop({ type: ApplicantsSchema })
  applicants: Applicants;

  @Prop({ type: JobPostWageSchema })
  wage: JobPostWage;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  closeDate: Date;

  @Prop()
  workload: string;

  @Prop()
  qualification: string;

  @Prop({ type: [String] })
  imageUrls: string[];

  @Prop({ type: JobPostLocationSchema })
  location: JobPostLocation;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: Date })
  reviewedAt?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  reviewedBy?: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  lastModifiedBy?: User;

  @Prop({ type: Date, default: null, expires: '30d' })
  deletedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  deletedBy?: User;
}

const JobPostSchema = SchemaFactory.createForClass(JobPost);

JobPostSchema.methods.softDelete = function (userId: string) {
  this.deletedAt = Date.now();
  this.deletedBy = userId;
  return this.save();
};

export { JobPostSchema };
