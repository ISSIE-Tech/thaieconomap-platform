import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SendTopicNotificationDto {
  @ApiProperty({ example: 'announcements' })
  @IsNotEmpty()
  @IsString()
  topic: string;

  @ApiProperty({ example: 'New Announcement' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Check out our latest update!' })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiPropertyOptional({ example: { type: 'announcement' } })
  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}
