import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

import { CreatePendingShareDto } from '../create/create-pending-share.dto';

export class UpdatePendingShareDto extends PartialType(CreatePendingShareDto) {
  @ApiProperty({
    example: 'Lorem...',
    required: false,
  })
  @IsOptional()
  @IsString()
  submissionMessage?: string;
}
