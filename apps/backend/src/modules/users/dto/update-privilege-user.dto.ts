import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '@thaieconomap/contracts';
import { IsEnum, IsMongoId, IsString } from 'class-validator';

import { IsPhoneNumber } from '../../../common/pipes';

export class UpdatePrivilegeUserDto {
  @ApiProperty({
    example: 'exampleNameAsString',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: '0812345678, 021234567 etc.' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: '677fad41b43b75974179208c' })
  @IsMongoId({ each: true })
  districts: string[];
}
