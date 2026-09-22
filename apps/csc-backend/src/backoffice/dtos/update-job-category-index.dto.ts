import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsMongoId,
} from 'class-validator';

export class UpdateJobCategoryIndexDto {
  @IsMongoId({ each: true })
  @ArrayUnique()
  @ArrayMaxSize(5)
  @ArrayMinSize(5)
  jobCategories: string[];
}
