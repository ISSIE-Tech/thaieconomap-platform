import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCloseTimeAfterOpenTime', async: false })
export class IsCloseTimeAfterOpenTimeConstraint implements ValidatorConstraintInterface {
  validate(close: number, validationArguments?: ValidationArguments): boolean {
    const open = validationArguments?.object?.['open'];

    return close > open;
  }

  defaultMessage(): string {
    return 'close must be after open';
  }
}

export function IsCloseTimeAfterOpenTime(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isCloseTimeAfterOpenTime',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCloseTimeAfterOpenTimeConstraint,
    });
  };
}
