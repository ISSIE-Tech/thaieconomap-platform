import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator';

import { CONFIG } from '../../constants';

export class OpeningTimeRequestDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(CONFIG.MAX_OPENING_TIME)
  open: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(CONFIG.MAX_OPENING_TIME)
  close: number;
}

export class OpeningRequestDto {
  @IsNotEmpty()
  @IsBoolean()
  enable: boolean;

  @IsNotEmpty()
  @IsString()
  day: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OpeningTimeRequestDto)
  hours: OpeningTimeRequestDto[];
}
