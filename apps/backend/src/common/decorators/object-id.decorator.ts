import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';
import mongoose from 'mongoose';

import { CODES } from '../../shared/constants';
import { ErrorException } from '../exceptions';

export const ObjectId = createParamDecorator((key: string, context: ExecutionContext) => {
  const req: Request = context.switchToHttp().getRequest();
  const id = req.params[key];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorException(CODES.TEC_001, undefined, `Invalid mongoID`);
  }

  return id;
});
