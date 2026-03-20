import { ICode, IResponse } from '../interfaces';

export const mapResponse = <T>(
  code: ICode,
  data: T = undefined,
  display: string = undefined,
  message: string | string[] = undefined,
): IResponse<T> => {
  return {
    ...code,
    display: display || code.display,
    message: message || code.message,
    data,
  };
};
