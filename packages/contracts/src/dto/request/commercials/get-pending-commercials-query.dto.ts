import { Transform, Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsOptional, IsPositive, IsString } from 'class-validator';

import { CommercialCategory, MongooseOrdering, SortedBy } from '../../../enums';

export class GetPendingCommercialsQueryDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEnum(CommercialCategory) category?: CommercialCategory;
  @IsOptional() @Type(() => Number) @IsPositive() page = 1;
  @IsOptional() @Type(() => Number) @IsPositive() perPage = 10;
  @IsOptional() @Type(() => Number) @IsEnum(MongooseOrdering) direction = MongooseOrdering.DESCENDING;
  @IsOptional() @IsString() @IsEnum(SortedBy) sortedBy = SortedBy.CREATED_AT;
  @IsOptional() @Transform(({ value }) => typeof value === 'string' ? value.split(',').map((s: string) => s.trim()) : value) @IsMongoId({ each: true }) types?: string[];
}
