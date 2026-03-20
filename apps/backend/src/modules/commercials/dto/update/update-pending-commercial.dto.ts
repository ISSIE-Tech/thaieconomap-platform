import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

import { CONFIG } from '../../../../config';
import { CreatePendingCommercialDto } from '../create/create-pending-commercial.dto';

export class UpdatePendingCommercialDto extends PartialType(CreatePendingCommercialDto) {
  @ApiProperty({
    example: 'Lorem...',
    required: false,
    maximum: CONFIG.MAX_TEXT_AREA_LENGTH,
  })
  @IsOptional()
  @IsString()
  submissionMessage?: string;
}
