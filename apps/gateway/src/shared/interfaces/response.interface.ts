import { HttpStatus } from '@nestjs/common';

import { UserDocument } from '../../modules/users/schemas';

import { ICredentials } from './token.interface';

export interface IResponse<T = unknown> {
  code: string;
  message: string | string[];
  display: string;
  statusCode?: HttpStatus;
  data?: T;
}

export interface IAuthResponse {
  credentials: ICredentials;
  user: UserDocument;
}
