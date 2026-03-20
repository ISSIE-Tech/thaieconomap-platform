import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { IsPhoneNumber } from '../../../common/decorators';
import { BackofficeService, UserRole } from '../../../shared/enums';

export class UpdatePrivilegeRoleDto {
  @ApiProperty({
    enum: UserRole,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    enum: BackofficeService,
  })
  @IsEnum(BackofficeService)
  @IsNotEmpty()
  service: BackofficeService;
}

export class UpdatePrivilegeUserDto {
  @ApiProperty({
    example: 'example',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: '0812345678',
  })
  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    type: UpdatePrivilegeRoleDto,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePrivilegeRoleDto)
  privilege: UpdatePrivilegeRoleDto;
}
