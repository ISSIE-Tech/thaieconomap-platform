export interface BaseResponseDto<T = unknown> {
  code: string;
  message: string | string[];
  display: string;
  statusCode?: number;
  data?: T;
}
