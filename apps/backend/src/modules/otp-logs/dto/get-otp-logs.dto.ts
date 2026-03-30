import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

import { OtpAction, OtpLogStatus } from '../schemas';

export class GetOtpLogsDto {
  @ApiPropertyOptional({ enum: OtpAction })
  @IsOptional()
  @IsEnum(OtpAction)
  action?: OtpAction;

  @ApiPropertyOptional({ enum: OtpLogStatus })
  @IsOptional()
  @IsEnum(OtpLogStatus)
  status?: OtpLogStatus;

  @ApiPropertyOptional({ example: '081' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

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
