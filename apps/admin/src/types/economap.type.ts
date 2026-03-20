import type { BaseResponseDto } from '@thaieconomap/contracts';

export type EconomapError = Pick<BaseResponseDto, 'display' | 'message'>;

export type AdditionalImageUpload = {
  code: string;
  data: string[];
  display: string;
  message: string;
};
