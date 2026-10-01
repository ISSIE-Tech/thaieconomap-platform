import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

import { SyncSource } from '../schemas';

export class ListSyncLogsDto {
  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '20' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}

export class ListSourceSyncLogsDto extends ListSyncLogsDto {
  @ApiPropertyOptional({ enum: SyncSource, default: SyncSource.TAMSANG })
  @IsOptional()
  @IsEnum(SyncSource)
  source?: SyncSource;
}

export class ListShopsDto extends ListSyncLogsDto {
  @ApiPropertyOptional({ example: 'ร้าน' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class SetShopHiddenDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  hidden: boolean;
}
