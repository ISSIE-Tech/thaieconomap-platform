import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import mongoose from 'mongoose';

export const ObjectId = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const req: Request = context.switchToHttp().getRequest();
    const id = String(req.params[key] ?? '');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`resource with id ${id} not found`);
    }
    return id;
  },
);
