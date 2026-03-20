import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { DevicePlatform } from '../schemas';

export class UpdateFcmTokenDto {
  @ApiProperty({ example: 'fcm_token_string_from_mobile_app' })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiPropertyOptional({ enum: DevicePlatform, example: DevicePlatform.ANDROID })
  @IsOptional()
  @IsEnum(DevicePlatform)
  platform?: DevicePlatform;
}
