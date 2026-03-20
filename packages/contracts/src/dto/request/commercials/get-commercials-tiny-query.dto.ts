import { Transform, Type } from 'class-transformer';
import { IsEnum, IsLatitude, IsLongitude, IsMongoId, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

import { CommercialCategory, CommercialWorkingHour, SearchLocation } from '../../../enums';

export class GetCommercialsTinyQueryDto {
  @IsOptional() @IsEnum(CommercialCategory) category?: CommercialCategory;
  @IsOptional() @IsEnum(SearchLocation) location = SearchLocation.ANYWHERE;
  @IsOptional() @IsEnum(CommercialWorkingHour) workingHour = CommercialWorkingHour.ANYTIME;
  @IsNotEmpty() @IsLatitude() @Type(() => Number) @ValidateIf((o: Record<string, unknown>) => o.location === SearchLocation.NEAR_ME) latitude: number;
  @IsNotEmpty() @IsLongitude() @Type(() => Number) @ValidateIf((o: Record<string, unknown>) => o.location === SearchLocation.NEAR_ME) longitude: number;
  @IsOptional() @Transform(({ value }) => typeof value === 'string' ? value.split(',').map((s: string) => s.trim()) : value) @IsMongoId({ each: true }) types?: string[];
}
