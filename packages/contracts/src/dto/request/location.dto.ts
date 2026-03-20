import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class LocationRequestDto {
  @IsNotEmpty()
  @IsLatitude()
  @Type(() => Number)
  latitude: number;

  @IsNotEmpty()
  @IsLongitude()
  @Type(() => Number)
  longitude: number;
}
