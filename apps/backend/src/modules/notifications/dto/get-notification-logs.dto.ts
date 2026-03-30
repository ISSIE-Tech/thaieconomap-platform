import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

import { FcmNotificationStatus } from '../schemas';

export class GetNotificationLogsDto {
  @ApiPropertyOptional({ enum: FcmNotificationStatus })
  @IsOptional()
  @IsEnum(FcmNotificationStatus)
  status?: FcmNotificationStatus;

  @ApiPropertyOptional({ example: 'device-token-abc' })
  @IsOptional()
  @IsString()
  sendTo?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({ example: '2026-01-31' })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '20' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
