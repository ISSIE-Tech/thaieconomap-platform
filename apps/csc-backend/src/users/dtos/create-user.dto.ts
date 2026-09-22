import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { UserRole } from '../schemas/user-role.enum';

export class CreateUserDto {
  @IsString()
  profileImageUrl: string;

  @IsString()
  lineId: string;

  @IsString()
  shortId: string;

  @IsString()
  name: string;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  birthDate: Date;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  experiences?: string;

  @IsOptional()
  @IsMongoId({ each: true })
  districts?: string[];

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
