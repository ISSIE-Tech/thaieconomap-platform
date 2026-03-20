import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  pumpuangId: string;

  @ApiProperty({ example: 'Order Update' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Your order is on the way!' })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiPropertyOptional({ example: { orderId: '123' } })
  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}
