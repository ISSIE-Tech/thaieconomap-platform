import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import { createCopyConditions } from 'nestjs-minio-client/dist/utils';
import * as crypto from 'crypto';
import sharp from 'sharp';
import { BufferedFile } from './file.interface';

// one bucket; soft-deleted objects live under this prefix instead of a second bucket
export const RECYCLE_PREFIX = 'recycle/';
const WEBP_QUALITY = 80;
const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

@Injectable()
export class MinioClientService {
  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(MinioClientService.name);
  private readonly bucket: string = this.configService.get('MINIO_BUCKET');

  private get client() {
    return this.minioService.client;
  }

  /**
   * The admin sends back the presigned URLs it is still showing; map each to the
   * stored object path. A value that is already a path passes through.
   */
  toObjectPath(value: string): string {
    if (!value.includes('://')) return value;

    const { pathname } = new URL(value);
    const path = decodeURIComponent(pathname).replace(/^\//, '');

    return path.startsWith(`${this.bucket}/`) ? path.slice(this.bucket.length + 1) : path;
  }

  /** the bucket is private: the DB stores object paths, this turns one into a temporary URL */
  getFileUrl(path: string): Promise<string> {
    return this.client.presignedUrl('GET', this.bucket, path, SEVEN_DAYS_IN_SECONDS);
  }

  /** every image is stored as webp, whatever was uploaded; returns the object path */
  async uploadFile(file: BufferedFile): Promise<string> {
    const objectName = `${crypto.randomUUID()}.webp`;
    try {
      const webp = await sharp(file.buffer)
        .rotate() // apply EXIF orientation before it is stripped
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
      await this.client.putObject(this.bucket, objectName, webp, webp.length, {
        'Content-Type': 'image/webp',
      });
      this.logger.log(`File ${objectName} uploaded successfully`);
    } catch (error) {
      this.logger.error(`Error uploading file ${objectName}`, error);
      throw new InternalServerErrorException(
        'Something went wrong in the upload-file process',
      );
    }
    return objectName;
  }

  moveObjectToRecycleBin(path: string): Promise<string> {
    return this.moveObject(path, RECYCLE_PREFIX + path);
  }

  restoreObjectFromRecycleBin(path: string): Promise<string> {
    return this.moveObject(path, path.replace(RECYCLE_PREFIX, ''));
  }

  private async moveObject(src: string, dest: string) {
    await this.client.copyObject(
      this.bucket,
      dest,
      `/${this.bucket}/${src}`,
      createCopyConditions(),
    );
    await this.delete(src);
    return dest;
  }

  async delete(objectName: string) {
    try {
      await this.client.removeObject(this.bucket, objectName);
      this.logger.log(`File ${objectName}, deleted successfully`);
    } catch (error) {
      this.logger.error(`Error deleting file ${objectName}`, error);
      throw new InternalServerErrorException(
        'Something went wrong in the delete-file process',
      );
    }
  }
}
