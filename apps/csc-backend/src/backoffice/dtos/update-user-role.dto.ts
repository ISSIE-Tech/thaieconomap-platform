import { IsEnum, IsString } from 'class-validator';
import { UserRole } from 'src/users/schemas/user-role.enum';

export class UpdateUserRoleDto {
  @IsString()
  shortId: string;

  @IsEnum(UserRole)
  role: UserRole;
}
