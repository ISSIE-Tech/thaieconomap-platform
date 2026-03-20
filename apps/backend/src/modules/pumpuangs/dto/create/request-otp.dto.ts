import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { IsPhoneNumber } from '../../../../common/pipes';

export class RequestOtpDto {
  @ApiProperty({ example: '0812345678, 021234567 etc.' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}
