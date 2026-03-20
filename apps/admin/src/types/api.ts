import type { BaseResponseDto } from '@thaieconomap/contracts';

export type ApiResponse<T> = Omit<BaseResponseDto<T>, 'data'> & { data: T };
