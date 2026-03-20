import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type, plainToClass } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { IsPhoneNumber } from '../../../../common/pipes';
import { CONFIG } from '../../../../config';
import { LocationDto } from '../../../../shared/dto';
import { jsonParse, transformPhoneNumber } from '../../../../shared/utils';
import { AmountWithUnit, Contact } from '../../schemas';

export class ContactDto {
  @ApiProperty({
    example: 'Lorem...',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  name: string;

  @ApiProperty({ example: '0812345678, 021234567 etc.' })
  @IsString()
  @Transform(({ value }) => transformPhoneNumber(value))
  @IsPhoneNumber()
  phoneNumber: string;
}

export class AmountWithUnitDto {
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'piece',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  unit: string;
}

export class CreatePendingShareDto {
  @ApiProperty({
    example: 'Lorem...',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  name: string;

  @ApiProperty({ example: ['6781338600ee11f67491dfd2'] })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(CONFIG.MAX_SHARE_TYPES)
  @IsMongoId({ each: true })
  @Transform(({ value }) => jsonParse(value))
  types: string[];

  @ApiProperty({ type: LocationDto })
  @IsNotEmpty()
  @ValidateNested()
  @Transform(({ value }) => plainToClass(LocationDto, jsonParse(value)))
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    example: 'Lorem...',
    required: false,
    maximum: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  @IsString()
  @IsOptional()
  @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH)
  address: string;

  @ApiProperty({ example: '66506b632c35732f0159133f' })
  @IsMongoId()
  @IsNotEmpty()
  district: string;

  @ApiProperty({
    example: 'Lorem...',
    required: false,
    maximum: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  @IsString()
  @IsOptional()
  @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH)
  detail?: string;

  @ApiProperty({ type: ContactDto })
  @IsNotEmpty()
  @ValidateNested()
  @Transform(({ value }) => plainToClass(ContactDto, jsonParse(value)))
  @Type(() => ContactDto)
  contact: Contact;

  @ApiProperty({ type: AmountWithUnitDto })
  @IsNotEmpty()
  @ValidateNested()
  @Transform(({ value }) => plainToClass(AmountWithUnitDto, jsonParse(value)))
  @Type(() => AmountWithUnitDto)
  amount: AmountWithUnit;

  @ApiProperty({ example: '6781339700ee11f67491dfd5' })
  @IsMongoId()
  @IsOptional()
  shipping: string;

  @ApiProperty({ example: '6781337400ee11f67491dfcf' })
  @IsMongoId()
  @IsNotEmpty()
  condition: string;

  @ApiProperty({
    example: 'Lorem...',
    required: false,
    maximum: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  @IsString()
  @IsOptional()
  @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH)
  moreDetail?: string;

  @ApiProperty({ example: ['image1Name', 'image2Name'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(CONFIG.MAX_ADDITIONAL_IMAGE)
  @Transform(({ value }) => jsonParse(value))
  additionalImageUrl?: string[];
}
