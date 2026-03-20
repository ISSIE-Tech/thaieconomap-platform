import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

import { CONFIG } from '../../../constants';
import { OpeningRequestDto } from '../opening.dto';

export class CreatePendingPumpuangDto {
  @IsString() @IsNotEmpty() @MaxLength(CONFIG.MAX_INPUT_LENGTH) name: string;
  @IsString() @IsNotEmpty() @MaxLength(CONFIG.MAX_INPUT_LENGTH) licensePlate: string;
  @IsString() @IsNotEmpty() @MaxLength(CONFIG.MAX_INPUT_LENGTH) color: string;
  @IsNotEmpty() @IsString() phoneNumber: string;
  @IsOptional() @IsString() @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH) moreInfo?: string;
  @IsNotEmpty() @IsArray() @ValidateNested({ each: true }) @Type(() => OpeningRequestDto) opening: OpeningRequestDto[];
  @IsOptional() @IsArray() @IsString({ each: true }) @ArrayMaxSize(CONFIG.MAX_ADDITIONAL_IMAGE) additionalImageUrl?: string[];
  @IsMongoId({ each: true }) @IsArray() @ArrayMaxSize(CONFIG.MAX_PUMPUANG_TYPES) @ArrayMinSize(1) @IsNotEmpty() types: string[];
  @IsString() @IsNotEmpty() @MaxLength(CONFIG.MAX_INPUT_LENGTH) owner: string;
}
