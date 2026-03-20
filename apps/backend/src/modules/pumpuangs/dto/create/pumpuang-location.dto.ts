import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// ----------------------------------------------------------------------

class CoordsDto {
  @ApiProperty({ example: 13.758029 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 100.511362 })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: 10.5 })
  @IsOptional()
  @IsNumber()
  accuracy?: number;

  @ApiPropertyOptional({ example: 2.5 })
  @IsOptional()
  @IsNumber()
  speed?: number;

  @ApiPropertyOptional({ example: 180.0 })
  @IsOptional()
  @IsNumber()
  heading?: number;

  @ApiPropertyOptional({ example: 50.0 })
  @IsOptional()
  @IsNumber()
  altitude?: number;
}

class ExtrasDto {
  @ApiPropertyOptional({ example: 'uuid-of-rider' })
  @IsOptional()
  @IsString()
  uuid?: string;

  @ApiPropertyOptional({ example: 'ชื่อคนขับ' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Pumpuang' })
  @IsOptional()
  @IsString()
  service?: string;
}

class ActivityDto {
  @ApiPropertyOptional({ example: 'in_vehicle' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 85 })
  @IsOptional()
  @IsNumber()
  confidence?: number;
}

class GeofenceDto {
  @ApiPropertyOptional({ example: 'zone-1' })
  @IsOptional()
  @IsString()
  identifier?: string;

  @ApiPropertyOptional({ example: 'ENTER' })
  @IsOptional()
  @IsString()
  action?: string;
}

class BatteryDto {
  @ApiPropertyOptional({ example: 0.85 })
  @IsOptional()
  @IsNumber()
  level?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_charging?: boolean;
}

class LocationPayloadDto {
  @ApiProperty({ type: CoordsDto })
  @IsNotEmpty()
  @Type(() => CoordsDto)
  @ValidateNested()
  coords: CoordsDto;

  @ApiPropertyOptional({ type: ExtrasDto })
  @IsOptional()
  @Type(() => ExtrasDto)
  @ValidateNested()
  extras?: ExtrasDto;

  @ApiPropertyOptional({ type: ActivityDto })
  @IsOptional()
  @Type(() => ActivityDto)
  @ValidateNested()
  activity?: ActivityDto;

  @ApiPropertyOptional({ type: GeofenceDto })
  @IsOptional()
  @Type(() => GeofenceDto)
  @ValidateNested()
  geofence?: GeofenceDto;

  @ApiPropertyOptional({ type: BatteryDto })
  @IsOptional()
  @Type(() => BatteryDto)
  @ValidateNested()
  battery?: BatteryDto;

  @ApiPropertyOptional({ example: '2025-05-05T04:31:54.123Z' })
  @IsOptional()
  @IsString()
  timestamp?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({ example: 'uuid-string' })
  @IsOptional()
  @IsString()
  uuid?: string;

  @ApiPropertyOptional({ example: 'motionchange' })
  @IsOptional()
  @IsString()
  event?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_moving?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_heartbeat?: boolean;

  @ApiPropertyOptional({ example: 1250.5 })
  @IsOptional()
  @IsNumber()
  odometer?: number;
}

// ----------------------------------------------------------------------

export class PumpuangLocationDto {
  @ApiProperty({ type: LocationPayloadDto })
  @IsNotEmpty()
  @Type(() => LocationPayloadDto)
  @ValidateNested()
  location: LocationPayloadDto;
}
