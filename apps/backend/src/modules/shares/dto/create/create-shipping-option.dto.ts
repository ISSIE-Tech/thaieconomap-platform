import { ApiProperty } from '@nestjs/swagger';

import { IsString, MaxLength } from 'class-validator';

import { CONFIG } from '../../../../config';

export class CreateShippingOptionDto {
  @ApiProperty({
    example: 'Lorem...',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsString()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  name: string;
}
