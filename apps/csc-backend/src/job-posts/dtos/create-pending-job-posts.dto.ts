import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { JobCategory } from '../schemas/job-category.schema';
import { Transform, Type } from 'class-transformer';
import { IsArrayOfBase64 } from 'src/common/decorators/is-array-of-base64.decorator';

class Applicants {
  @IsNumber()
  number: number;
}

class Address {
  @IsString()
  name: string;

  @IsString()
  district: string;
}

class Location {
  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;

  @ValidateNested()
  @Type(() => Address)
  address: Address;
}

class Wage {
  @IsNumber()
  amount: number;

  @IsString()
  unit: string;
}

export class CreatePendingJobPostsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: JobCategory;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ value }) => JSON.parse(value))
  // @ValidateNested()
  // @Type(() => Applicants)
  applicants: Applicants;

  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  wage: Wage;

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

  // @IsOptional()
  // // @IsArrayOfBase64()
  // images?: string[]

  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  // @ValidateNested()
  // @Type(() => Location)
  location: Location;
}
