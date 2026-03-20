import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetDistrictsFilterDto {
  @IsNumberString() @IsOptional() provinceId?: number;
  @IsString() @IsOptional() provinceName?: string;
}
