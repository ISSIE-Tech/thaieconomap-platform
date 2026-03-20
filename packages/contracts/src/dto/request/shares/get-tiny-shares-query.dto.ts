import { Transform, Type } from 'class-transformer';
import { IsEnum, IsLatitude, IsLongitude, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

import { CONFIG } from '../../../constants';
import { SearchLocation } from '../../../enums';

export class GetTinySharesQueryDto {
  @IsOptional() @IsString() @MaxLength(CONFIG.MAX_INPUT_LENGTH) name?: string;
  @IsOptional() @IsMongoId() district?: string;
  @IsOptional() @Transform(({ value }) => typeof value === 'string' ? value.replace(/ /g, '').split(',') : value) @IsMongoId({ each: true }) types?: string[];
  @IsOptional() @IsEnum(SearchLocation) location = SearchLocation.ANYWHERE;
  @IsNotEmpty() @IsLatitude() @Type(() => Number) @ValidateIf((o: Record<string, unknown>) => o.location === SearchLocation.NEAR_ME) latitude: number;
  @IsNotEmpty() @IsLongitude() @Type(() => Number) @ValidateIf((o: Record<string, unknown>) => o.location === SearchLocation.NEAR_ME) longitude: number;
}
