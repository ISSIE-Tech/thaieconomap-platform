import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { IsPhoneNumber } from '../../../common/pipes';
import { CONFIG } from '../../../config';
import { transformPhoneNumber } from '../../../shared/utils';

export class CreateAnnouncementDto {
  @ApiProperty({
    example: 'Lorem...',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  name: string;

  @ApiProperty({ example: new Date() })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  startAt: Date;

  @ApiProperty({ example: new Date() })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  endAt: Date;

  @ApiProperty({
    example: 'Lorem...',
    maximum: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  @IsString()
  @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH)
  detail: string;

  @ApiProperty({
    example: ['66506b632c35732f0159133f'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  districts: string[];

  @ApiProperty({
    example: 'Lorem...',
    required: false,
    maximum: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH)
  subDistricts: string;

  @ApiProperty({
    example: 'Lorem...',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsString()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  announcer: string;

  @ApiProperty({ example: '0812345678, 021234567 etc.' })
  @IsString()
  @Transform(({ value }) => transformPhoneNumber(value))
  @IsPhoneNumber()
  phoneNumber: string;
}
