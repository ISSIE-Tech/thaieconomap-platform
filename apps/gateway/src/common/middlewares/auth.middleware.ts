import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import * as passport from 'passport';

import { CODES } from '../../shared/constants';
import { ErrorException } from '../exceptions';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return next();
    }

    passport.authenticate('jwt-access-token', { session: false }, (err, user) => {
      if (err || !user) {
        return next(new ErrorException(CODES.AGW_002));
      }

      req.user = user;

      return next();
    })(req, res, next);
  }
}
