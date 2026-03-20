import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { CONFIG } from '../../../constants';

export class CreateAnnouncementDto {
  @IsNotEmpty() @IsString() @MaxLength(CONFIG.MAX_INPUT_LENGTH) name: string;
  @Transform(({ value }) => new Date(value), { toClassOnly: true }) @IsDate() startAt: Date;
  @Transform(({ value }) => new Date(value), { toClassOnly: true }) @IsDate() endAt: Date;
  @IsString() @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH) detail: string;
  @IsArray() @IsMongoId({ each: true }) @ArrayMinSize(1) districts: string[];
  @IsOptional() @IsString() @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH) subDistricts: string;
  @IsString() @MaxLength(CONFIG.MAX_INPUT_LENGTH) announcer: string;
  @IsString() phoneNumber: string;
}
