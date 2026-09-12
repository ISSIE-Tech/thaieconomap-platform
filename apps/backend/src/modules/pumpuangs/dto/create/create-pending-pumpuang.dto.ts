import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type, plainToClass } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { IsPhoneNumber } from '../../../../common/pipes/';
import { CONFIG } from '../../../../config';
import { OpeningDto } from '../../../../shared/dto';
import { jsonParse, transformPhoneNumber } from '../../../../shared/utils';

export class CreatePendingPumpuangDto {
  @ApiProperty({
    example: 'Lorem...',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  name: string;

  @ApiProperty({
    example: 'กธ1991',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  licensePlate: string;

  @ApiProperty({
    example: 'สีชมพู',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  color: string;

  @ApiProperty({ example: '0812345678, 021234567 etc.' })
  @IsNotEmpty()
  @Transform(({ value }) => transformPhoneNumber(value))
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: 'Lorem...',
    required: false,
    maximum: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH)
  moreInfo?: string;

  @ApiProperty({
    type: [OpeningDto],
  })
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => plainToClass(OpeningDto, jsonParse(value)))
  @ValidateNested({ each: true })
  @Type(() => OpeningDto)
  opening: OpeningDto[];

  @ApiProperty({
    example: ['image1Name', 'image2Name'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => jsonParse(value))
  @ArrayMaxSize(CONFIG.MAX_ADDITIONAL_IMAGE)
  additionalImageUrl?: string[];

  @ApiProperty({
    example: ['672ca44c8bf128c92c6002cd'],
  })
  @Transform(({ value }) => jsonParse(value))
  @IsMongoId({ each: true })
  @IsArray()
  @ArrayMaxSize(CONFIG.MAX_PUMPUANG_TYPES)
  @ArrayMinSize(1)
  @IsNotEmpty()
  types: string[];

  @ApiProperty({
    example: 'Lorem...',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  owner: string;
}
