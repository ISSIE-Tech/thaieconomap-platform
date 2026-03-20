import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';
import mongoose from 'mongoose';

import { CODES } from '../../shared/constants';
import { ErrorException } from '../exceptions';

export const ObjectId = createParamDecorator((key: string, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest<Request>();
  const id = req.params[key];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorException(CODES.AGW_001);
  }

  return id;
});
