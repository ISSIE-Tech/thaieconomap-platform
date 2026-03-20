import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

import { CONFIG } from '../../../../config';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';
import { splitComma } from '../../../../shared/utils';

export class GetPendingSharesQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(CONFIG.MAX_INPUT_LENGTH)
  name?: string;

  @IsOptional()
  @Transform(({ value }) => splitComma(value))
  @IsMongoId({ each: true })
  types?: string[];

  @IsOptional()
  @IsMongoId()
  district?: string;
}
