import { context, trace } from '@opentelemetry/api';

import { ErrorException } from '../../common/exceptions';
import { CODES } from '../constants';

export const prettyObjectString = (obj: object): string => {
  return `${JSON.stringify(obj, null, 2)}`;
};

export const getSpanName = (): string => {
  try {
    return trace.getSpan(context.active())['name'];
  } catch (_error) {
    return '';
  }
};

export const splitComma = (value: string): string[] => {
  try {
    return value.replace(/ /g, '').split(',');
  } catch (error) {
    throw new ErrorException(CODES.TEC_001, undefined, error.message);
  }
};

export const jsonParse = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new ErrorException(CODES.TEC_001, undefined, error.message);
  }
};

export const escapeHyphens = (input: string): string => {
  return input.replace(/-/g, '\\-');
};

export const generateRandomString = (
  length: number,
  chars: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
): string => {
  let result = '';

  for (let i = 0; i < length; ++i) result += chars[Math.floor(Math.random() * chars.length)];

  return result;
};
