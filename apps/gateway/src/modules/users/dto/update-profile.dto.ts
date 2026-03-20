import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

import { IsPhoneNumber } from '../../../common/decorators';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'example',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'example@example.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    example: '0812345678',
  })
  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @ApiProperty({
    example: new Date(),
  })
  @IsDate()
  @IsOptional()
  dateOfBirth: Date;
}
