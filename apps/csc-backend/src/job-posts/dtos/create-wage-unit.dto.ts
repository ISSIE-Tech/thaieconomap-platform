import { IsString } from 'class-validator';

export class CreateWageUnitDto {
  @IsString()
  name: string;
}
