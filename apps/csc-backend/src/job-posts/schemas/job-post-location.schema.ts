import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import {
  JobPostAddress,
  JobPostAddressSchema,
} from './job-post-address.schema';

export type JobPostLocationDocument = HydratedDocument<JobPostLocation>;

@Schema({ _id: false })
export class JobPostLocation {
  @Prop({ type: JobPostAddressSchema })
  address: JobPostAddress;

  @Prop()
  latitude: string;

  @Prop()
  longitude: string;
}

export const JobPostLocationSchema =
  SchemaFactory.createForClass(JobPostLocation);
