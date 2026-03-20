import { IsEnum, IsOptional } from 'class-validator';

import { UserRole } from '../../../shared/enums';

export class UserRolesDto {
  @IsEnum(UserRole)
  @IsOptional()
  TEC: UserRole;

  @IsEnum(UserRole)
  @IsOptional()
  CSC: UserRole;
}
