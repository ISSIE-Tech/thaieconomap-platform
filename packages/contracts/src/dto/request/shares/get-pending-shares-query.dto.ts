import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

import { CONFIG } from '../../../constants';
import { PaginationRequestDto } from '../pagination.dto';

export class GetPendingSharesQueryDto extends PaginationRequestDto {
  @IsOptional() @IsString() @MaxLength(CONFIG.MAX_INPUT_LENGTH) name?: string;
  @IsOptional() @Transform(({ value }) => typeof value === 'string' ? value.split(',').map((s: string) => s.trim()) : value) @IsMongoId({ each: true }) types?: string[];
  @IsOptional() @IsMongoId() district?: string;
}
