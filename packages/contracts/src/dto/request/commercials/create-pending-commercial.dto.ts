import { Type } from 'class-transformer';
import {
  ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsMongoId, IsNotEmpty,
  IsOptional, IsString, MaxLength, ValidateNested,
} from 'class-validator';

import { CONFIG } from '../../../constants';
import { CommercialCategory } from '../../../enums';
import { LocationRequestDto } from '../location.dto';
import { OpeningRequestDto } from '../opening.dto';

export class CreatePendingCommercialDto {
  @IsString() @IsNotEmpty() @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  name: string;

  @IsNotEmpty() @IsEnum(CommercialCategory)
  category: CommercialCategory;

  @IsNotEmpty() @ValidateNested() @Type(() => LocationRequestDto)
  location: LocationRequestDto;

  @IsNotEmpty() @IsArray() @ValidateNested({ each: true }) @Type(() => OpeningRequestDto)
  opening: OpeningRequestDto[];

  @IsMongoId() @IsNotEmpty()
  district: string;

  @IsNotEmpty() @IsString() @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  commercialOwner: string;

  @IsNotEmpty() @IsString()
  phoneNumber: string;

  @IsOptional() @IsString() @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH)
  moreInfo?: string;

  @IsOptional() @IsArray() @IsString({ each: true }) @ArrayMaxSize(CONFIG.MAX_ADDITIONAL_IMAGE)
  additionalImageUrl?: string[];

  @IsMongoId({ each: true }) @IsArray() @ArrayMaxSize(CONFIG.MAX_COMMERCIALS_TYPE) @ArrayMinSize(1) @IsNotEmpty()
  types: string[];
}
