import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional } from 'class-validator';

import { splitComma } from '../../../shared/utils';

export class GetAnnouncementsQueryDto {
  @IsOptional()
  @Transform(({ value }) => splitComma(value))
  @IsMongoId({ each: true })
  districts?: string[];

  // @IsOptional()
  // @IsNumberString()
  // provinceId?: number;
}
