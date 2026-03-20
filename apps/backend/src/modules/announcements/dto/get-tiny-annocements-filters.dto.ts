import { Transform } from 'class-transformer';
import { IsDate, IsMongoId, IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetTinyAnnouncementsQueryDto {
  @IsOptional()
  @IsString()
  @IsMongoId()
  district?: string;

  @IsOptional()
  @IsNumberString()
  provinceId?: number;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  date: Date;
}
