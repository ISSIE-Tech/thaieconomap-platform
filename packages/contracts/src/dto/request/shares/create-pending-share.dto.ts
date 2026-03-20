import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

import { CONFIG } from '../../../constants';
import { LocationRequestDto } from '../location.dto';

export class ContactDto {
  @IsNotEmpty() @IsString() @MaxLength(CONFIG.MAX_INPUT_LENGTH) name: string;
  @IsString() phoneNumber: string;
}

export class AmountWithUnitDto {
  @IsNotEmpty() @IsNumber() amount: number;
  @IsNotEmpty() @IsString() @MaxLength(CONFIG.MAX_INPUT_LENGTH) unit: string;
}

export class CreatePendingShareDto {
  @IsNotEmpty() @IsString() @MaxLength(CONFIG.MAX_INPUT_LENGTH) name: string;
  @IsNotEmpty() @IsArray() @ArrayMinSize(1) @ArrayMaxSize(CONFIG.MAX_SHARE_TYPES) @IsMongoId({ each: true }) types: string[];
  @IsNotEmpty() @ValidateNested() @Type(() => LocationRequestDto) location: LocationRequestDto;
  @IsString() @IsOptional() @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH) address: string;
  @IsMongoId() @IsNotEmpty() district: string;
  @IsString() @IsOptional() @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH) detail?: string;
  @IsNotEmpty() @ValidateNested() @Type(() => ContactDto) contact: ContactDto;
  @IsNotEmpty() @ValidateNested() @Type(() => AmountWithUnitDto) amount: AmountWithUnitDto;
  @IsMongoId() @IsOptional() shipping: string;
  @IsMongoId() @IsNotEmpty() condition: string;
  @IsString() @IsOptional() @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH) moreDetail?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) @ArrayMaxSize(CONFIG.MAX_ADDITIONAL_IMAGE) additionalImageUrl?: string[];
}
