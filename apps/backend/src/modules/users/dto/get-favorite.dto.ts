import { FavoriteCategories } from '@thaieconomap/contracts';
import { IsEnum, IsOptional, IsString } from 'class-validator';


export class GetFavoriteDto {
  @IsOptional()
  @IsEnum(FavoriteCategories)
  @IsString()
  category?: string;
}
