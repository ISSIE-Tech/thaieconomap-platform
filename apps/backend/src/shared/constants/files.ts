import { IFilePolicy } from '../interfaces';

export const ANNOUNCEMENT_FILE_POLICY: IFilePolicy = {
  type: /(pdf)/,
  maxSize: 3145728, // B => 3MB
};

export const COMMERCIAL_FILE_POLICY: IFilePolicy = {
  type: /(jpg|jpeg|png)/,
  maxSize: 3145728, // B => 3MB
};

export const SHARES_FILE_POLICY: IFilePolicy = {
  type: /(jpg|jpeg|png)/,
  maxSize: 3145728, // B => 3MB
};

export const PUMPUANG_FILE_POLICY: IFilePolicy = {
  type: /(jpg|jpeg|png)/,
  maxSize: 3145728, // B => 3MB
};
