import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class GetJobPostsFilterDto {
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsNumber()
  @IsPositive()
  @Max(9999)
  perPage = 10;

  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsNumber()
  @IsPositive()
  page = 1;

  @Transform(({ value }: { value: string }) => value.toLowerCase() === 'true')
  @IsBoolean()
  ascending = false;

  @IsMongoId()
  @IsOptional()
  category?: string;

  @IsMongoId()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  searchTerm?: string;
}
