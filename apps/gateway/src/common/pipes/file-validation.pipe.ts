import { Injectable, PipeTransform } from '@nestjs/common';

import { Express } from 'express';

import { CODES } from '../../shared/constants';
import { ErrorException } from '../exceptions';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private fileType: RegExp;
  private maxSize: number;

  constructor(fileType: RegExp = /(jpg|jpeg|png)/, maxSize: number = 5242880) {
    this.fileType = fileType;
    this.maxSize = maxSize;
  }

  transform(file: Express.Multer.File): Express.Multer.File | undefined {
    if (!file) {
      return undefined;
    }

    if (!this.fileType.test(file.mimetype)) {
      throw new ErrorException(CODES.AGW_011);
    }

    if (file.size > this.maxSize) {
      throw new ErrorException(CODES.AGW_012);
    }

    return file;
  }
}
