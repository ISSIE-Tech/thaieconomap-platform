import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import isBase64 from 'is-base64';

export function IsArrayOfBase64(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isArrayOfBase64',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }

          for (const element of value) {
            if (!isBase64(element)) {
              return false;
            }
          }

          return true;
        },
      },
    });
  };
}
