import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { CONFIG } from '../../../../config';

export class CreateBusinessTypeDto {
  @ApiProperty({
    example: 'Lorem...',
    maximum: CONFIG.MAX_INPUT_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  name: string;
}
