import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class LocationDto {
  @ApiProperty({ example: 13.758029019803585 })
  @IsNotEmpty()
  @IsLatitude()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({ example: 100.51136255264282 })
  @IsNotEmpty()
  @IsLongitude()
  @Type(() => Number)
  longitude: number;
}
