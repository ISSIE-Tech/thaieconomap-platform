import {
  CommercialCategory,
  CommercialWorkingHour,
  SearchLocation,
} from '@thaieconomap/contracts';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

import { splitComma } from '../../../../shared/utils';

export class GetCommercialsTinyQueryDto {
  @IsOptional()
  @IsEnum(CommercialCategory)
  category?: CommercialCategory;

  @IsOptional()
  @IsEnum(SearchLocation)
  location = SearchLocation.ANYWHERE;

  @IsOptional()
  @IsEnum(CommercialWorkingHour)
  workingHour = CommercialWorkingHour.ANYTIME;

  @IsNotEmpty()
  @IsLatitude()
  @Type(() => Number)
  @ValidateIf(({ location }) => location === SearchLocation.NEAR_ME)
  latitude: number;

  @IsNotEmpty()
  @IsLongitude()
  @Type(() => Number)
  @ValidateIf(({ location }) => location === SearchLocation.NEAR_ME)
  longitude: number;

  @IsOptional()
  @Transform(({ value }) => splitComma(value))
  @IsMongoId({ each: true })
  types?: string[];
}
