import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

// multipart sends nested objects as JSON strings, same as CreatePendingJobPostsDto
const parseJson = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? JSON.parse(value) : value;

class Applicants {
  @IsNumber()
  @Min(1)
  number: number;
}

class Wage {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  unit: string;
}

/** What the backoffice may change on an existing job post. Every field is optional. */
export class UpdateBackofficeJobPostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsMongoId()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  workload?: string;

  @IsString()
  @IsOptional()
  qualification?: string;

  @Transform(parseJson, { toClassOnly: true })
  @ValidateNested()
  @Type(() => Applicants)
  @IsOptional()
  applicants?: Applicants;

  @Transform(parseJson, { toClassOnly: true })
  @ValidateNested()
  @Type(() => Wage)
  @IsOptional()
  wage?: Wage;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsOptional()
  closeDate?: Date;

  /**
   * Existing images to keep, as the URLs the admin was shown. Anything already
   * on the post and not listed here is deleted. Omit the field to keep all.
   */
  @Transform(parseJson, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  keepImages?: string[];
}
