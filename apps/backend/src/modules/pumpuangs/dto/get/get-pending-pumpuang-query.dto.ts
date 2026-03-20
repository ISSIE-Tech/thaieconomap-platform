import { MongooseOrdering, SortedBy } from '@thaieconomap/contracts';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsOptional, IsPositive, IsString } from 'class-validator';

import { splitComma } from '../../../../shared/utils';

export class GetPendingPumpuangQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  perPage = 10;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(MongooseOrdering)
  direction = MongooseOrdering.DESCENDING;

  @IsOptional()
  @IsString()
  @IsEnum(SortedBy)
  sortedBy = SortedBy.CREATED_AT;

  @IsOptional()
  @Transform(({ value }) => splitComma(value))
  @IsMongoId({ each: true })
  types?: string[];
}
