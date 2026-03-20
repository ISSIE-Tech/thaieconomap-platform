import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveFcmTokenDto {
  @ApiProperty({ example: 'fcm_token_string_from_mobile_app' })
  @IsNotEmpty()
  @IsString()
  token: string;
}
