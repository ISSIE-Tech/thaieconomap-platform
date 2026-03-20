import { applyDecorators } from '@nestjs/common';

import { IsNumberString, Length, ValidationOptions } from 'class-validator';

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  // Uncomment if you want to check the phoneNumber is startwith '0'
  // const startWithZeroRegEx = /^[0].*/;

  return applyDecorators(
    IsNumberString(),
    Length(9, 10, validationOptions) as PropertyDecorator,
    // Matches(startWithZeroRegEx, validationOptions) as PropertyDecorator
  );
}
