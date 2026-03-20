import { Injectable, Logger } from '@nestjs/common';

import { Express } from 'express';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../common/exceptions';
import { CONFIG } from '../../config';
import { CODES, MINIO_FOLDER } from '../../shared/constants';
import { IUser } from '../../shared/interfaces';
import {
  devErrorBuilder,
  getDiffValidEntities,
  getSpanName,
  prettyObjectString,
} from '../../shared/utils';
import { MinioClientService } from '../minio-client/minio-client.service';

@Injectable()
export class AdditionalImageService {
  private readonly logger: Logger = new Logger(AdditionalImageService.name);

  constructor(private readonly minioClientService: MinioClientService) {}

  @Span('Move Additional Image')
  async moveAdditionalImage(
    uniqueId: string,
    fileNames: string[],
    dstDirectory: string,
  ): Promise<string[]> {
    const ctx = `${AdditionalImageService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        uniqueId,
        fileNames,
        dstDirectory,
      })}`,
    );

    const fileNameMap = new Map();
    const filePaths = fileNames.map(fileName => {
      const newFileName = fileName.replace(`.${uniqueId}`, '');
      const tempFilePath = `${MINIO_FOLDER.temporary}/${fileName}`;

      fileNameMap.set(newFileName, fileName);
      fileNameMap.set(tempFilePath, newFileName);

      return tempFilePath;
    });

    const images = this.minioClientService.moveFiles(
      filePaths,
      MINIO_FOLDER.temporary,
      dstDirectory,
      fileNameMap,
    );

    this.logger.verbose(
      `{${ctx}} (moved additional images) data:\n${prettyObjectString({
        images,
      })}`,
    );

    return images;
  }

  async getUpdateAdditionalImageUrlQuery(
    user: IUser,
    newAdditionalImageUrl: string[],
    curAdditionalImageUrl: string[],
    dstDirectory: string,
  ): Promise<string[]> {
    const newImageUrl = [];
    const newUniqueImageUrl = new Set<string>();
    const remainImageUrl = [];
    const remainUniqueImageUrl = new Set<string>();

    newAdditionalImageUrl.forEach(url => {
      if (!url.startsWith(dstDirectory)) {
        newUniqueImageUrl.add(url);
      } else {
        remainUniqueImageUrl.add(url);
      }
    });

    newImageUrl.push(...newUniqueImageUrl);
    remainImageUrl.push(...remainUniqueImageUrl);

    this.checkAdditionalImagePermission(user._id, newImageUrl, remainImageUrl);

    //Note: check if incoming image url belong to updating commercial
    const isOwnAllUrl = getDiffValidEntities(remainImageUrl, curAdditionalImageUrl);

    if (isOwnAllUrl.length) {
      throw new ErrorException(CODES.TEC_048);
    }
    //

    const deleteImageUrl = getDiffValidEntities(curAdditionalImageUrl, remainImageUrl);

    if (newImageUrl.length) {
      const movedImageUrl = await this.moveAdditionalImage(user._id, newImageUrl, dstDirectory);

      remainImageUrl.push(...movedImageUrl);
    }

    if (deleteImageUrl.length) {
      await this.deleteManyAdditionalImage(deleteImageUrl);
    }

    return remainImageUrl;
  }

  @Span('Check Additional Image Permission')
  checkAdditionalImagePermission(
    uniqueId: string,
    filenames: string[],
    currentAddtionalImage: string[],
  ): void {
    this.logger.debug(
      `{${AdditionalImageService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        uniqueId,
        filenames,
        currentAddtionalImage,
      })}`,
    );

    if (filenames.length + currentAddtionalImage.length > CONFIG.MAX_ADDITIONAL_IMAGE) {
      throw new ErrorException(CODES.TEC_050);
    }

    filenames.map(filename => {
      const owner = filename.split('.', 2).pop();

      if (owner !== uniqueId) {
        throw devErrorBuilder(
          CODES.TEC_049,
          'You don\'t have permission for this set of additional images',
        );
      }
    });
  }

  @Span('Upload Additional Image')
  async uploadAdditionalImage(
    uniqueId: string,
    images: Array<Express.Multer.File>,
    fileTypePolicy: RegExp,
  ): Promise<string[]> {
    const ctx = `${AdditionalImageService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        uniqueId,
        fileTypePolicy,
      })}`,
    );

    this.logger.verbose(`{${ctx}} (moving images)`);

    const instruction = images.map(image =>
      this.minioClientService.upload(MINIO_FOLDER.temporary, image, fileTypePolicy, `.${uniqueId}`),
    );

    const uploadResults = await Promise.allSettled(instruction);
    const succeedUpload = uploadResults.flatMap(result => {
      if (result.status === 'fulfilled') {
        return [result.value?.split('/', 2).pop()];
      }

      return [];
    });

    this.logger.verbose(
      `{${ctx}} (upload additional image) images:\n${prettyObjectString({
        images: succeedUpload,
      })}`,
    );

    if (uploadResults.length !== succeedUpload.length) {
      this.logger.verbose(`{${ctx}} (can't upload given all the image)`);

      await this.minioClientService.deleteManyFiles(succeedUpload);

      this.logger.verbose(
        `{${ctx}} (undo upload additional image) images:\n${prettyObjectString({
          images: succeedUpload,
        })}`,
      );

      throw new ErrorException(CODES.TEC_041, undefined, 'Failed to upload files');
    }

    return succeedUpload;
  }

  @Span('Delete Additional Image Url')
  async deleteAdditionalImageUrl(fileName: string, additionalImageUrl: string[]): Promise<void> {
    const ctx = `${AdditionalImageService.name}-[${getSpanName()}]}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        fileName,
        additionalImageUrl,
      })}`,
    );

    if (!additionalImageUrl) {
      throw new ErrorException(CODES.TEC_048);
    }

    const haveImage = additionalImageUrl.some(name => name === fileName);

    this.logger.verbose(
      `{${ctx}} (have image) haveImage:${prettyObjectString({
        haveImage,
      })}`,
    );

    if (!haveImage) {
      throw new ErrorException(CODES.TEC_048);
    }

    await this.minioClientService.deleteFile(fileName);
  }

  @Span('Delete Many Additional Image Url')
  async deleteManyAdditionalImage(additionalImageUrl: string[]): Promise<void> {
    const ctx = `${AdditionalImageService.name}-[${getSpanName()}]}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        additionalImageUrl,
      })}`,
    );

    if (!additionalImageUrl.length) {
      throw new ErrorException(CODES.TEC_048);
    }

    await this.minioClientService.deleteManyFiles(additionalImageUrl);
  }
}
