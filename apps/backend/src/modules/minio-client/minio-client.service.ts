import * as path from 'path';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HttpMethod } from '@thaieconomap/contracts';
import { Express } from 'express';
import * as Minio from 'minio';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../common/exceptions';
import { CODES, GLOBAL_CONFIG, SEVEN_DAYS_IN_SECONDS } from '../../shared/constants';
import { generateMd5Hash, getSpanName, prettyObjectString } from '../../shared/utils';

@Injectable()
export class MinioClientService implements OnModuleInit {
  private readonly bucketName = this.configService.get<string>(GLOBAL_CONFIG.MINIO_BUCKET);
  private readonly minioClient: Minio.Client;
  private readonly logger: Logger = new Logger(MinioClientService.name);

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>(GLOBAL_CONFIG.MINIO_ENDPOINT),
      port: this.configService.get<number>(GLOBAL_CONFIG.MINIO_PORT),
      useSSL: this.configService.get<boolean>(GLOBAL_CONFIG.MINIO_USE_SSL),
      accessKey: this.configService.get<string>(GLOBAL_CONFIG.MINIO_ACCESS_KEY),
      secretKey: this.configService.get<string>(GLOBAL_CONFIG.MINIO_SECRET_KEY),
      region: this.configService.get<string>(GLOBAL_CONFIG.MINIO_REGION),
    });
  }

  async onModuleInit() {
    this.logger.log(`{${MinioClientService.name}} (connect to s3 minio)`);

    try {
      await this.minioClient.bucketExists(this.bucketName);
      this.logger.log('connect to s3 minio successful');
    } catch (error) {
      this.logger.error('connect to s3 minio failed', error);
    }
  }

  @Span('Upload File')
  async upload(
    directoryName: string,
    file: Express.Multer.File,
    supportedMimeTypes: RegExp = /(jpg|jpeg|png)/,
    suffixFileName: string = '',
  ): Promise<string> {
    this.logger.debug(
      `{${MinioClientService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        directoryName,
        filename: file?.filename,
        supportedMimeTypes,
        suffixFileName,
      })}`,
    );

    if (!file || !file.buffer || !file.originalname) {
      throw new ErrorException(CODES.TEC_042);
    }

    if (!supportedMimeTypes.test(file.mimetype)) {
      throw new ErrorException(CODES.TEC_019);
    }

    const timestamp = Date.now().toString();
    const randomNumber = Math.random();
    const hashedFileName = generateMd5Hash(`${randomNumber}${timestamp}${file.originalname}`);
    const ext = path.extname(file.originalname);
    const filename = `${directoryName}/${hashedFileName}${suffixFileName}${ext}`;

    await this.uploadFile(filename, file.buffer, file.size);

    return filename;
  }

  @Span('Delete File')
  async deleteFile(filename: string): Promise<void> {
    this.logger.debug(
      `{${MinioClientService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filename,
      })}`,
    );

    await this.deleteManyFiles([filename]);
  }

  @Span('Delete Many Files')
  async deleteManyFiles(filenames: string[]): Promise<void> {
    this.logger.debug(
      `{${MinioClientService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filenames,
      })}`,
    );

    try {
      await Promise.all(
        filenames.map(filename => this.minioClient.removeObject(this.bucketName, filename)),
      );
    } catch (error) {
      this.logger.error(error);

      throw new ErrorException(CODES.TEC_041, undefined, 'Failed to delete files');
    }
  }

  @Span('Replace File')
  async replaceFile(
    directoryName: string,
    newFile: Express.Multer.File,
    oldFilename: string,
    supportedMimeTypes?: RegExp,
  ): Promise<string> {
    this.logger.debug(
      `{${MinioClientService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        directoryName,
        newFileName: newFile?.filename,
        oldFilename,
        supportedMimeTypes,
      })}`,
    );

    const newFilename = await this.upload(directoryName, newFile, supportedMimeTypes);

    await this.deleteFile(oldFilename);

    return newFilename;
  }

  @Span('Get File Url')
  async getFileUrl(fileName: string): Promise<string> {
    const url = await this.minioClient.presignedUrl(
      HttpMethod.GET,
      this.bucketName,
      fileName,
      SEVEN_DAYS_IN_SECONDS,
    );

    if (!url) {
      throw new ErrorException(CODES.TEC_043);
    }

    return url;
  }

  @Span('Copy File')
  async copyFile(filePath: string, dstDirectory: string, copiedFileName?: string): Promise<string> {
    try {
      this.logger.debug(
        `{${MinioClientService.name}-[${getSpanName()}]} (called)\
        \n[param] ${prettyObjectString({
          filePath,
          dstDirectory,
          copiedFileName,
        })}`,
      );

      const fileName = copiedFileName ? copiedFileName : filePath.split('/').pop();
      const srcFileName = `/${this.bucketName}/${filePath}`;
      const dstFileName = `${dstDirectory}/${fileName}`;

      await this.minioClient.copyObject(
        this.bucketName,
        dstFileName,
        srcFileName,
        new Minio.CopyConditions(),
      );

      return dstFileName;
    } catch (error) {
      this.logger.error(error);

      throw new ErrorException(CODES.TEC_041, undefined, 'Failed to copy file');
    }
  }

  @Span('Move File')
  async moveFile(filePath: string, dstDirectory: string, newFileName?: string): Promise<string> {
    this.logger.debug(
      `{${MinioClientService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filePath,
        dstDirectory,
        newFileName,
      })}`,
    );

    const file = await this.copyFile(filePath, dstDirectory, newFileName);

    await this.deleteFile(filePath);

    return file;
  }

  @Span('Move Files')
  async moveFiles(
    filePaths: string[],
    srcDirectory: string,
    dstDirectory: string,
    fileNameMap?: Map<string, string>,
  ): Promise<string[]> {
    const ctx = `${MinioClientService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        filePaths,
        srcDirectory,
        dstDirectory,
        fileNameMap,
      })}`,
    );

    const instruction = filePaths.map(filePath => {
      const newFileName = fileNameMap ? fileNameMap.get(filePath) : undefined;

      return this.moveFile(filePath, dstDirectory, newFileName);
    });

    const movedImages = await Promise.allSettled(instruction);
    const images = movedImages.flatMap(result => {
      if (result.status === 'fulfilled') {
        return [result.value];
      }

      return [];
    });

    this.logger.verbose(
      `{${ctx}} (moved images) data:\n${prettyObjectString({
        images,
      })}`,
    );

    if (images.length !== filePaths.length) {
      this.logger.verbose(`{${ctx}} (can't upload given all the image)`);

      const undoInsruction = images.map(filePath => {
        const fileName = filePath.split(`${dstDirectory}/`).pop();
        const originalFileName = fileNameMap ? fileNameMap.get(fileName) : fileName;

        return this.moveFile(filePath, srcDirectory, originalFileName);
      });

      this.logger.verbose(
        `{${ctx}} (undo move image) data:\n${prettyObjectString({
          images,
        })}`,
      );

      this.logger.verbose(`{${ctx}} (moving images)`);

      await Promise.allSettled(undoInsruction);

      throw new ErrorException(CODES.TEC_054);
    }

    return images;
  }

  @Span('Upload File to minio')
  private async uploadFile(filename: string, buffer: Buffer, size: number): Promise<void> {
    try {
      this.logger.debug(
        `{${MinioClientService.name}-[${getSpanName()}]} (called)\
        \n[param] ${prettyObjectString({
          filename,
          size,
        })}`,
      );

      await this.minioClient.putObject(this.bucketName, filename, buffer, size);
    } catch (error) {
      this.logger.error(error);

      throw new ErrorException(CODES.TEC_041, undefined, 'Failed to upload file');
    }
  }
}
