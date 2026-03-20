import { Injectable, Logger, PipeTransform } from '@nestjs/common';

import { Express } from 'express';

import { CODES } from '../../shared/constants';
import { convertBytesToMB } from '../../shared/utils';
import { ErrorException } from '../exceptions';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly logger = new Logger(FileValidationPipe.name);
  private fileType: RegExp;
  private maxSize: number;
  private required: boolean;

  constructor(
    fileType: RegExp = /(jpg|jpeg|png|pdf)/,
    maxSize: number = 5242880,
    required: boolean = true,
  ) {
    this.fileType = fileType;
    this.maxSize = maxSize;
    this.required = required;
  }

  async transform(
    files: Express.Multer.File | Array<Express.Multer.File>,
  ): Promise<Express.Multer.File | Array<Express.Multer.File>> {
    if (files instanceof Array) {
      return this.validateFiles(files);
    }

    return this.validateFile(files);
  }

  private validateFile(file: Express.Multer.File) {
    if (this.required && !file) {
      this.logger.debug('File is required but not provided');

      throw new ErrorException(CODES.TEC_029, `กรุณาอัพโหลดไฟล์`, `File is required.`);
    }

    if (file && !this.fileType.test(file.mimetype)) {
      this.logger.debug(`Invalid file type: ${file.mimetype}. Allowed types: ${this.fileType}`);

      throw new ErrorException(
        CODES.TEC_019,
        `ประเภทไฟล์ไม่ถูกต้อง ประเภทไฟล์ปัจจุบันคือ ${file.mimetype} ประเภทที่อนุญาตคือ ${this.fileType}`,
        `Invalid file type. Current type is ${file.mimetype}. Allowed types: ${this.fileType}.`,
      );
    }

    if (file && file.size > this.maxSize) {
      const currentFileSizeMB = convertBytesToMB(file.size).toFixed(2);
      const maxSizeMB = convertBytesToMB(this.maxSize).toFixed(2);

      this.logger.debug(`File too large: ${currentFileSizeMB}MB. Max allowed: ${maxSizeMB}MB`);

      throw new ErrorException(
        CODES.TEC_018,
        `ขนาดไฟล์ใหญ่เกินไป ขนาดไฟล์ปัจจุบันคือ ${currentFileSizeMB}MB, ควรอัพไม่เกิน ${maxSizeMB}MB`,
        `File too large. Current file size is ${currentFileSizeMB}MB, should not exceed ${maxSizeMB}MB.`,
      );
    }

    return file;
  }

  private validateFiles(files: Array<Express.Multer.File>) {
    if (this.required && !files.length) {
      this.logger.debug('Files are required but none provided');

      throw new ErrorException(CODES.TEC_029, `กรุณาอัพโหลดไฟล์`, `File is required.`);
    }

    files.forEach(file => {
      this.validateFile(file);
    });

    return files;
  }
}
