import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type JobPostWageDocument = HydratedDocument<JobPostWage>;

@Schema({ _id: false })
export class JobPostWage {
  @Prop()
  amount: number;

  @Prop()
  unit: string;
}

export const JobPostWageSchema = SchemaFactory.createForClass(JobPostWage);
