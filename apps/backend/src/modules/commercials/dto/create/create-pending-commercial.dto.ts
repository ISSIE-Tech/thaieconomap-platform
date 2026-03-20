import { ApiProperty } from '@nestjs/swagger';

import { CommercialCategory } from '@thaieconomap/contracts';
import { Transform, Type, plainToClass } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { IsPhoneNumber } from '../../../../common/pipes/';
import { CONFIG } from '../../../../config';
import { LocationDto, OpeningDto } from '../../../../shared/dto';
import { jsonParse, transfromPhoneNumber } from '../../../../shared/utils';

export class CreatePendingCommercialDto {
  @ApiProperty({
    example: 'exampleNameAsString',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  name: string;

  @ApiProperty({ enum: CommercialCategory })
  @IsNotEmpty()
  @IsEnum(CommercialCategory)
  category: CommercialCategory;

  @ApiProperty({ type: LocationDto })
  @IsNotEmpty()
  @ValidateNested()
  @Transform(({ value }) => plainToClass(LocationDto, jsonParse(value)))
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({ type: [OpeningDto], description: 'Array of OpeningDto' })
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => plainToClass(OpeningDto, jsonParse(value)))
  @ValidateNested({ each: true })
  @Type(() => OpeningDto)
  opening: OpeningDto[];

  @ApiProperty({
    example: '66506b632c35732f0159133f',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsMongoId()
  @IsNotEmpty()
  district: string;

  @ApiProperty({
    example: 'exampleOwnerNameAsString',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  commercialOwner: string;

  @ApiProperty({ example: '0812345678, 021234567 etc.' })
  @IsNotEmpty()
  @Transform(({ value }) => transfromPhoneNumber(value))
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: 'lorem...',
    required: false,
    maximum: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH)
  moreInfo?: string;

  @ApiProperty({
    example: ['lorem...'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => jsonParse(value))
  @ArrayMaxSize(CONFIG.MAX_ADDITIONAL_IMAGE)
  additionalImageUrl?: string[];

  @ApiProperty({ example: ['6694062b79660716e8b9fa21'] })
  @Transform(({ value }) => jsonParse(value))
  @IsMongoId({ each: true })
  @IsArray()
  @ArrayMaxSize(CONFIG.MAX_COMMERCIALS_TYPE)
  @ArrayMinSize(1)
  @IsNotEmpty()
  types: string[];
}
