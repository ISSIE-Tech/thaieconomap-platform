import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

import { IsCloseTimeAfterOpenTime } from '../../common/decorators';
import { CONFIG } from '../../config';

export class OpeningTimeDto {
  @ApiProperty({
    example: 540,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(CONFIG.MAX_OPENING_TIME)
  open: number;

  @ApiProperty({
    example: 1020,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(CONFIG.MAX_OPENING_TIME)
  @IsCloseTimeAfterOpenTime()
  close: number;
}
