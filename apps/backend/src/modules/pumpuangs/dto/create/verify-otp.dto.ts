import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, Length } from 'class-validator';

import { IsPhoneNumber } from '../../../../common/pipes';

export class VerifyOtpDto {
  @ApiProperty({ example: '0812345678, 021234567 etc.' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: '123456',
    minimum: 6,
    maximum: 6,
  })
  @Length(6, 6)
  @IsNotEmpty()
  @IsString()
  pin: string;
}
