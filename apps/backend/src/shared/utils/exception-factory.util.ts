import { ConfigService } from '@nestjs/config';

import { ValidationError } from 'class-validator';

import { ErrorException } from '../../common/exceptions';
import { CODES, GLOBAL_CONFIG } from '../constants';
import { ICode } from '../interfaces';

const configService = new ConfigService();

export const validationExceptionFactory = (errors: ValidationError[]): ErrorException => {
  const message = errors.flatMap(error => {
    return backTrackErrorConstraints(error);
  });

  return devErrorBuilder(CODES.TEC_001, message);
};

export const devErrorBuilder = (
  code: ICode,
  message: string | string[] = undefined,
): ErrorException => {
  const isDevelopment = configService.get(GLOBAL_CONFIG.IS_DEV);

  return new ErrorException(code, undefined, isDevelopment ? message : undefined);
};

const backTrackErrorConstraints = (error: ValidationError): string[] => {
  const parent = new Map([[error.property, []]]);
  const children = error.children;
  const results = [];

  if (children.length) {
    children.forEach((child: ValidationError) => {
      parent.get(error.property).push(...backTrackErrorConstraints(child));
    });

    results.push(Object.fromEntries(parent.entries()));
  }

  if (error.constraints) {
    results.push(...Object.values(error.constraints));
  }

  return results;
};
