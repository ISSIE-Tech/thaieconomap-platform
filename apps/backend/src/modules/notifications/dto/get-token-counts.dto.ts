import { ApiProperty } from '@nestjs/swagger';

import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class GetTokenCountsDto {
  @ApiProperty({ example: ['id1', 'id2', 'id3'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
