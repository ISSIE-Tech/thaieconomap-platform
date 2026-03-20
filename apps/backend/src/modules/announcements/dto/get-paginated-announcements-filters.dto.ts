import { MongooseOrdering, SortedBy } from '@thaieconomap/contracts';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';


import { GetTinyAnnouncementsQueryDto } from './get-tiny-annocements-filters.dto';

export class GetPaginatedAnnouncementsQueryDto extends GetTinyAnnouncementsQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @Type(() => Number)
  @IsPositive()
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @Type(() => Number)
  @IsPositive()
  perPage: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(MongooseOrdering)
  direction = MongooseOrdering.DESCENDING;

  @IsOptional()
  @IsString()
  @IsEnum(SortedBy)
  sortedBy = SortedBy.CREATED_AT;
}
