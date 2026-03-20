import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FavoriteCategories } from '../../../enums';

export class GetFavoriteDto {
  @IsOptional() @IsEnum(FavoriteCategories) @IsString() category?: string;
}
