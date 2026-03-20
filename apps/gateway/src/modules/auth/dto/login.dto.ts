import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'aaabbbbccccc',
  })
  @IsNotEmpty()
  @IsString()
  authorizationCode: string;
}
