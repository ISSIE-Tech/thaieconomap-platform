import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class RequestSessionDto {
  @ApiProperty({ example: '123-wac-456' })
  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
