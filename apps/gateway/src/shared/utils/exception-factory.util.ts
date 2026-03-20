import { ValidationError } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ErrorException } from '../../common/exceptions';
import { CODES, globalConfig } from '../constants';
import { ICode } from '../interfaces';

const configService = new ConfigService();

export const validationExceptionFactory = (errors: ValidationError[]): ErrorException => {
  const message = errors.flatMap(error => getErrorConstraints(error));

  return errorBuilder(CODES.AGW_001, message);
};

export const errorBuilder = (
  code: ICode,
  message: string | string[] = undefined,
): ErrorException => {
  const isDev = configService.get<boolean>(globalConfig.IS_DEV);

  return new ErrorException(code, undefined, isDev ? message : undefined);
};

const getErrorConstraints = (error: ValidationError): string[] => {
  const children = error.children;
  const results: string[] = [];

  if (children) {
    children.forEach((child: ValidationError) => {
      results.push(...getErrorConstraints(child));
    });
  }

  if (error.constraints) {
    results.push(...Object.values(error.constraints));
  }

  return results;
};
