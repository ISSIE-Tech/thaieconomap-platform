import { BaseResponseDto } from '@thaieconomap/contracts';

export type ApiResponse<T> = Omit<BaseResponseDto<T>, 'data'> & { data: T };

// TODO: this is only for chial share category
export type ChialShareApiResponse<T> = T & {
  statusCode: string;
  message: string;
};

// Type guard to check if error matches ApiResponse
export function isApiResponse(error: unknown): error is ApiResponse<unknown> {
  return (
    error !== null &&
    error !== undefined &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error &&
    'display' in error
  );
}
