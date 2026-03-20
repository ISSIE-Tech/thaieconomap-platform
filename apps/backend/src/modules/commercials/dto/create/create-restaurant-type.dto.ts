import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { CONFIG } from '../../../../config';

export class CreateRestaurantTypeDto {
  @ApiProperty({
    example: 'Lorem...',
    maximum: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  name: string;
}
