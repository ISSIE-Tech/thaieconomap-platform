import { HttpStatus } from '@nestjs/common';

export interface ICode {
  code: string;
  message: string;
  display: string;
  statusCode: HttpStatus;
}

export type ICodeObj = Record<string, ICode>;
