import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { District } from 'src/districts/district.schema';

export type JobPostAddressDocument = HydratedDocument<JobPostAddress>;

@Schema({ _id: false })
export class JobPostAddress {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'District' })
  district: District;
}

export const JobPostAddressSchema =
  SchemaFactory.createForClass(JobPostAddress);
