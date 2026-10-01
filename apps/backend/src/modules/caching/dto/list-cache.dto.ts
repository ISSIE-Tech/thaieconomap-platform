import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsNumberString, IsOptional, IsString } from 'class-validator';

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
