import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';

export const CurrentSession = createParamDecorator(
  (key: string | undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const session = request['session'];

    if (key) {
      return session && session[key];
    }

    return session;
  },
);
