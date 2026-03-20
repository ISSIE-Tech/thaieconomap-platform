import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IsPhoneNumber } from '../../../common/decorators';
import { OauthProvider } from '../../../shared/enums';

import { UserRolesDto } from './user-roles.dto';

class CreateOauthDto {
  @IsEnum(OauthProvider)
  provider: OauthProvider;

  @IsString()
  sub: string;
}

export class CreateUserDto {
  @IsString()
  shortId: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  displayName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  profileImageUrl: string;

  @IsDate()
  @IsOptional()
  dateOfBirth: Date;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => UserRolesDto)
  @IsOptional()
  roles: UserRolesDto;

  @ValidateNested()
  @Type(() => CreateOauthDto)
  oauth: CreateOauthDto;
}
