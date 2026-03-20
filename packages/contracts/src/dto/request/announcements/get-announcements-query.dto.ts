import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional } from 'class-validator';

export class GetAnnouncementsQueryDto {
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.split(',').map((s: string) => s.trim()) : value)
  @IsMongoId({ each: true })
  districts?: string[];
}
