import { ApiProperty } from '@nestjs/swagger';

import { IsString, MaxLength } from 'class-validator';

import { CONFIG } from '../../config';

export class SubmissionMessageDto {
  @ApiProperty({
    example: 'Lorem...',
    maximum: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  @IsString()
  @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH)
  submissionMessage: string;
}
