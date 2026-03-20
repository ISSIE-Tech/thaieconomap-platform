import { HttpStatus } from '@nestjs/common';

export interface IResponse<T = unknown> {
  code: string;
  message: string | string[];
  display: string;
  statusCode?: HttpStatus;
  data?: T;
}
