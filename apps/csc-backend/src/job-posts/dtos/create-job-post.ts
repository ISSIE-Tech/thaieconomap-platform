import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { JobCategory } from '../schemas/job-category.schema';
import { Transform } from 'class-transformer';

export class CreateJobPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: JobCategory;

  @IsString()
  @IsNotEmpty()
  description: string;

  // @Prop({ type: ApplicantsSchema })
  // applicants: Applicants
  @IsNumber()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  wage: string;

  @IsString()
  @IsNotEmpty()
  wageUnit: string;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsOptional()
  closeDate?: Date;

  @IsString()
  @IsNotEmpty()
  workload: string;

  @IsString()
  @IsNotEmpty()
  qualification: string;

  @IsOptional()
  imageUrls?: string[];

  @IsString()
  @IsNotEmpty()
  latitude: string;

  @IsString()
  @IsNotEmpty()
  longitude: string;
}
