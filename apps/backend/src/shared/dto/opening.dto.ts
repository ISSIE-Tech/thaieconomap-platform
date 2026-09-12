import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { DayName } from '@thaieconomap/contracts';

import { OpeningTimeDto } from './opening-time.dto';

export class OpeningDto {
  @ApiProperty({
    example: true,
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  enable: boolean;

  @ApiProperty({
    enum: DayName,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  day: string;

  @ApiProperty({
    type: OpeningTimeDto,
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OpeningTimeDto)
  hours: OpeningTimeDto[];
}
