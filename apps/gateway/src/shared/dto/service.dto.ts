import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty } from 'class-validator';

import { BackofficeService } from '../enums';

export class BackofficeServiceDto {
  @ApiProperty({
    example: `${BackofficeService.CSC}|${BackofficeService.TEC}`,
    required: true,
  })
  @IsEnum(BackofficeService)
  @IsNotEmpty()
  service: BackofficeService;
}
