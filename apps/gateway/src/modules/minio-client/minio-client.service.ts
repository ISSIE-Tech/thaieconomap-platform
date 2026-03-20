import * as path from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Express } from 'express';
import * as Minio from 'minio';

import { ErrorException } from '../../common/exceptions';
import { CODES, globalConfig, supportedMimeTypes } from '../../shared/constants';
import { generateMd5Hash } from '../../shared/utils';

@Injectable()
export class MinioClientService {
  private readonly bucketName = this.configService.get<string>(globalConfig.MINIO_BUCKET_NAME);
  private readonly minioClient: Minio.Client;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>(globalConfig.MINIO_ENDPOINT),
      useSSL: this.configService.get<boolean>(globalConfig.MINIO_USE_SSL),
      accessKey: this.configService.get<string>(globalConfig.MINIO_ACCESS_KEY),
      secretKey: this.configService.get<string>(globalConfig.MINIO_SECRET_KEY),
      region: this.configService.get<string>(globalConfig.MINIO_REGION),
    });
  }

  async upload(directoryName: string, file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer || !file.originalname) {
      throw new ErrorException(CODES.AGW_008);
    }

    if (!supportedMimeTypes.test(file.mimetype)) {
      throw new ErrorException(CODES.AGW_011);
    }

    const timestamp = Date.now().toString();
    const hashedFileName = generateMd5Hash(timestamp);
    const ext = path.extname(file.originalname);
    const filename = `${directoryName}/${hashedFileName}${ext}`;

    await this.uploadFile(filename, file.buffer, file.size);

    return filename;
  }

  async getFileUrl(fileName: string): Promise<string> {
    const url = await this.minioClient.presignedUrl('GET', this.bucketName, fileName);

    if (!url) {
      throw new ErrorException(CODES.AGW_010);
    }

    return url;
  }

  async deleteByUrl(url: string): Promise<void> {
    const filename = this.extractFilenameFromUrl(url);

    if (!filename) {
      throw new ErrorException(CODES.AGW_008, undefined, 'Invalid file name');
    }

    await this.deleteFile(filename);
  }

  private extractFilenameFromUrl(url: string): string {
    return url.split(this.bucketName)[1].split('?')[0];
  }

  private async uploadFile(filename: string, buffer: Buffer, size: number): Promise<void> {
    try {
      await this.minioClient.putObject(this.bucketName, filename, buffer, size);
    } catch (error) {
      throw new ErrorException(CODES.AGW_009, undefined, 'Failed to upload file');
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, filename);
    } catch (error) {
      throw new ErrorException(CODES.AGW_009, undefined, 'Failed to delete file');
    }
  }
}
