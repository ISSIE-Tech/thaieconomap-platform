import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateServiceUserDto {
  @IsMongoId()
  @IsNotEmpty()
  authId: string;
}
