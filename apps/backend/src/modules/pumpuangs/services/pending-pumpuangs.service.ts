import { randomUUID } from 'node:crypto';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SubmissionStatus } from '@thaieconomap/contracts';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-yet';
import { Express } from 'express';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { RedisClientType, SchemaFieldTypes } from 'redis';

import { ErrorException } from '../../../common/exceptions';
import { CONFIG } from '../../../config';
import { AdditionalImageService } from '../../../modules/additional-image';
import { MinioClientService } from '../../../modules/minio-client/minio-client.service';
import {
  CACHE_KEY,
  CODES,
  GLOBAL_CONFIG,
  MINIO_FOLDER,
  ONE_MONTH_IN_MS,
  PUMPUANG_FILE_POLICY,
  REDIS_INDEX_NAME,
} from '../../../shared/constants';
import {
  IPaginationQuery,
  IPaginationResponse,
  IRequestSessionResponse,
  IUser,
} from '../../../shared/interfaces';
import {
  escapeHyphens,
  generateHmacSha256Hash,
  prettyObjectString,
  transformOpeningToDisplayOpening,
} from '../../../shared/utils';
import {
  CreatePendingPumpuangDto,
  GetPendingPumpuangQueryDto,
  RequestSessionDto,
  UpdatePendingPumpuangDto,
} from '../dto';
import { PendingPumpuangRepository, PumpuangRepository } from '../repositories';
import { PendingPumpuangDocument, PumpuangDocument } from '../schemas';

import { ProductTypesService } from './product-types.service';

@Injectable()
export class PendingPumpuangsService implements OnModuleInit {
  private basePopulation = ['types'];
  private readonly logger: Logger = new Logger(PendingPumpuangsService.name);
  private redisClient: RedisClientType;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    private readonly pendingPumpuangRepository: PendingPumpuangRepository,
    private readonly pumpuangRepository: PumpuangRepository,
    private readonly minioClientService: MinioClientService,
    private readonly additionalImageService: AdditionalImageService,
    private readonly configService: ConfigService,

    @Inject(forwardRef(() => ProductTypesService))
    private readonly productTypesService: ProductTypesService,
  ) {
    this.redisClient = (this.cacheManager.store as RedisStore).client;
  }

  async onModuleInit() {
    await this.createPumpuangSessionIndex();
  }

  async getOne(
    filterQuery: FilterQuery<PumpuangDocument>,
    projection?: ProjectionType<PumpuangDocument>,
    options?: QueryOptions<PumpuangDocument>,
  ): Promise<PendingPumpuangDocument> {
    return this.pendingPumpuangRepository.findOne(filterQuery, projection, options);
  }

  async getAllPendingPumpuang(): Promise<PendingPumpuangDocument[]> {
    return this.pendingPumpuangRepository.find({}, {}, { populate: this.basePopulation });
  }

  async getPendingPumpuang(
    getPendingPumpuangQueryDto: GetPendingPumpuangQueryDto,
  ): Promise<IPaginationResponse<PendingPumpuangDocument>> {
    const ctx = `${PendingPumpuangsService.name}-${this.getPendingPumpuang.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        getPendingPumpuangQueryDto,
      })}`,
    );

    const query: IPaginationQuery<PendingPumpuangDocument> = getPendingPumpuangQueryDto;

    if (query?.types) {
      query.types = { $in: query.types };
    }

    query.submissionStatus = SubmissionStatus.PENDING;

    this.logger.verbose(
      `{${ctx}} (find pending pumpuang by query) query:\n${prettyObjectString({
        query,
      })}`,
    );

    return this.pendingPumpuangRepository.findWithPagination(
      query,
      ['name'],
      {},
      this.basePopulation,
    );
  }

  async getPendingPumpuangById(
    user: IUser,
    pendingPumpuangId: string,
  ): Promise<PendingPumpuangDocument> {
    const pendingPumpuang = await this.pendingPumpuangRepository.findById(
      pendingPumpuangId,
      {},
      {
        populate: this.basePopulation,
      },
    );

    if (!pendingPumpuang) {
      throw new ErrorException(CODES.TEC_067);
    }

    return pendingPumpuang;
  }

  async createPendingPumpuang(
    sessionId: string,
    createPendingPumpuangDto: CreatePendingPumpuangDto,
    image: Express.Multer.File,
  ): Promise<PendingPumpuangDocument> {
    const ctx = `${PendingPumpuangsService.name}-${this.createPendingPumpuang.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        sessionId,
        createPendingPumpuangDto,
      })}`,
    );

    await this.checkPhoneNumberExistsInPumpuangOrThrow(createPendingPumpuangDto.phoneNumber);

    await this.productTypesService.checkAllProductTypesExist(createPendingPumpuangDto.types);

    if (createPendingPumpuangDto.additionalImageUrl) {
      this.additionalImageService.checkAdditionalImagePermission(
        sessionId,
        createPendingPumpuangDto.additionalImageUrl,
        [],
      );

      createPendingPumpuangDto.additionalImageUrl =
        await this.additionalImageService.moveAdditionalImage(
          sessionId,
          createPendingPumpuangDto.additionalImageUrl,
          MINIO_FOLDER.pumpuang,
        );
    }

    const uploadedImage = await this.minioClientService.upload(MINIO_FOLDER.pumpuang, image);
    const displayOpening = transformOpeningToDisplayOpening(createPendingPumpuangDto.opening);
    const createPendingPumpuang = {
      ...createPendingPumpuangDto,
      displayOpening,
      imageUrl: uploadedImage,
    };

    this.logger.verbose(
      `{${ctx}} (create pending pumpuang data) data:\n${prettyObjectString({
        createPendingPumpuang,
      })}`,
    );

    return this.pendingPumpuangRepository.create(createPendingPumpuang);
  }

  async updatePendingPumpuang(
    user: IUser,
    pendingPumpuangId: string,
    updatePendingPumpuangDto: UpdatePendingPumpuangDto,
    image: Express.Multer.File,
  ): Promise<PendingPumpuangDocument> {
    const ctx = `${PendingPumpuangsService.name}-${this.updatePendingPumpuang.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pendingPumpuangId,
        updatePendingPumpuangDto,
      })}`,
    );

    const pendingPumpuang = await this.getPendingPumpuangById(user, pendingPumpuangId);

    await this.checkPhoneNumberExistsInPumpuangOrThrow(updatePendingPumpuangDto?.phoneNumber);

    const { additionalImageUrl, ...updateQuery } = updatePendingPumpuangDto;

    if (additionalImageUrl?.length) {
      this.additionalImageService.checkAdditionalImagePermission(
        user._id,
        additionalImageUrl,
        pendingPumpuang.additionalImageUrl,
      );
    }

    const updatePendingPumpuang = {
      ...updateQuery,
      $push: additionalImageUrl?.length
        ? {
            additionalImageUrl: {
              $each: await this.additionalImageService.moveAdditionalImage(
                user._id,
                additionalImageUrl,
                MINIO_FOLDER.pumpuang,
              ),
            },
          }
        : {},
      imageUrl: image
        ? await this.minioClientService.replaceFile(
            MINIO_FOLDER.pumpuang,
            image,
            pendingPumpuang.imageUrl,
          )
        : pendingPumpuang.imageUrl,
      displayOpening: updatePendingPumpuangDto?.opening
        ? transformOpeningToDisplayOpening(updatePendingPumpuangDto.opening)
        : pendingPumpuang.displayOpening,
    };

    this.logger.verbose(
      `{${ctx}} (update pending pumpuang data) data:\n${prettyObjectString({
        updatePendingPumpuang,
      })}`,
    );

    return this.pendingPumpuangRepository.findByIdAndUpdate(
      pendingPumpuangId,
      updatePendingPumpuang,
    );
  }

  async uploadAdditionalImage(
    sessionId: string,
    images: Array<Express.Multer.File>,
  ): Promise<string[]> {
    this.logger.debug(
      `{${PendingPumpuangsService.name}-${this.uploadAdditionalImage.name}} (called)\
      \n[param] ${prettyObjectString({
        sessionId,
      })}`,
    );

    return this.additionalImageService.uploadAdditionalImage(
      sessionId,
      images,
      PUMPUANG_FILE_POLICY.type,
    );
  }

  async approvePendingPumpuang(user: IUser, pendingPumpuangId: string): Promise<PumpuangDocument> {
    const ctx = `${PendingPumpuangsService.name}-${this.approvePendingPumpuang.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pendingPumpuangId,
      })}`,
    );

    const pendingPumpuang = await this.getPendingPumpuangById(user, pendingPumpuangId);
    const isRejected = pendingPumpuang.submissionStatus === SubmissionStatus.REJECTED;

    if (isRejected) {
      throw new ErrorException(CODES.TEC_062);
    }

    const pumpuangPhoneNumberExists = await this.pumpuangRepository.findOne({
      phoneNumber: pendingPumpuang.phoneNumber,
    });

    if (pumpuangPhoneNumberExists) {
      throw new ErrorException(CODES.TEC_072);
    }

    const pumpuang = {
      ...pendingPumpuang,
      approvedBy: user._id,
      lastModifiedBy: user._id,
      submissionStatus: SubmissionStatus.ACCEPTED,
      rejectedAutoDelete: undefined,
      rejectedCompletelyDeleteAt: undefined,
    };

    this.logger.verbose(
      `{${ctx}} (create pumpuang when approve pending pumpuang) data:\n${prettyObjectString({
        pumpuang,
      })}`,
    );

    const createdPumpuang = await this.pumpuangRepository.create(pumpuang);

    this.logger.verbose(
      `{${ctx}} (delete pending pumpuang when approve pumpuang) data:\n${prettyObjectString({
        pendingPumpuangId,
      })}`,
    );

    await this.pendingPumpuangRepository.findByIdAndDelete(pendingPumpuangId);

    await this.pendingPumpuangRepository.updateMany(
      {
        phoneNumber: pendingPumpuang.phoneNumber,
      },
      { submissionStatus: SubmissionStatus.REJECTED },
    );

    return createdPumpuang;
  }

  async rejectPendingPumpuang(
    user: IUser,
    pendingPumpuangId: string,
    submissionMessage: string,
  ): Promise<void> {
    const ctx = `${PendingPumpuangsService.name}-${this.rejectPendingPumpuang.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pendingPumpuangId,
        submissionMessage,
      })}`,
    );

    const pendingPumpuang = await this.getPendingPumpuangById(user, pendingPumpuangId);
    const isRejected = pendingPumpuang.submissionStatus === SubmissionStatus.REJECTED;

    if (isRejected) {
      throw new ErrorException(CODES.TEC_063);
    }

    const imageUrl = await this.minioClientService.moveFile(
      pendingPumpuang.imageUrl,
      `${MINIO_FOLDER.bin}/${MINIO_FOLDER.pumpuang}`,
    );

    if (!imageUrl) {
      throw new ErrorException(CODES.TEC_054);
    }

    const additionalImageUrl = pendingPumpuang.additionalImageUrl
      ? await this.minioClientService.moveFiles(
          pendingPumpuang.additionalImageUrl,
          MINIO_FOLDER.pumpuang,
          `${MINIO_FOLDER.bin}/${MINIO_FOLDER.pumpuang}`,
        )
      : undefined;

    const rejectPendingPumpuang = {
      submissionStatus: SubmissionStatus.REJECTED,
      submissionMessage,
      rejectedAutoDelete: new Date(),
      rejectedCompletelyDeleteAt: Date.now() + ONE_MONTH_IN_MS,
      imageUrl,
      additionalImageUrl,
    };

    this.logger.verbose(
      `{${ctx}} (update pending pumpuang when reject) data:\n${prettyObjectString({
        rejectPendingPumpuang,
      })}`,
    );

    await this.pendingPumpuangRepository.findByIdAndUpdate(
      pendingPumpuangId,
      rejectPendingPumpuang,
    );
  }

  async deleteAdditionalImageUrl(
    user: IUser,
    pendingPumpuangId: string,
    fileName: string,
  ): Promise<PendingPumpuangDocument> {
    this.logger.debug(
      `{${PendingPumpuangsService.name}-${this.deleteAdditionalImageUrl.name}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pendingPumpuangId,
        fileName,
      })}`,
    );

    const pendingPumpuang = await this.getPendingPumpuangById(user, pendingPumpuangId);

    await this.additionalImageService.deleteAdditionalImageUrl(
      fileName,
      pendingPumpuang.additionalImageUrl,
    );

    return this.pendingPumpuangRepository.findByIdAndUpdate(pendingPumpuangId, {
      $pull: { additionalImageUrl: fileName },
    });
  }

  async restoreRejectedPendingPumpuang(user: IUser, pendingPumpuangId: string) {
    const ctx = `${PendingPumpuangsService.name}-${this.restoreRejectedPendingPumpuang.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pendingPumpuangId,
      })}`,
    );

    const pendingCommercial = await this.getPendingPumpuangById(user, pendingPumpuangId);
    const isRejected = pendingCommercial.submissionStatus === SubmissionStatus.REJECTED;

    if (!isRejected) {
      throw new ErrorException(CODES.TEC_066);
    }

    const imageUrl = await this.minioClientService.moveFile(
      pendingCommercial.imageUrl,
      MINIO_FOLDER.pumpuang,
    );

    if (!imageUrl) {
      throw new ErrorException(CODES.TEC_054);
    }

    const additionalImageUrl = pendingCommercial.additionalImageUrl
      ? await this.minioClientService.moveFiles(
          pendingCommercial.additionalImageUrl,
          `${MINIO_FOLDER.bin}/${MINIO_FOLDER.pumpuang}`,
          MINIO_FOLDER.pumpuang,
        )
      : undefined;

    const updatePendingCommercial = {
      imageUrl,
      submissionStatus: SubmissionStatus.PENDING,
      submissionMessage: '',
      rejectedAutoDelete: null,
      rejectedCompletelyDeleteAt: null,
      additionalImageUrl,
    };

    this.logger.verbose(
      `{${ctx}} (update pending pumpuang when restore) data:\n${prettyObjectString({
        pendingCommercial,
      })}`,
    );

    return this.pendingPumpuangRepository.findByIdAndUpdate(
      pendingPumpuangId,
      updatePendingCommercial,
    );
  }

  async requestSession(requestSessionDto: RequestSessionDto): Promise<IRequestSessionResponse> {
    const { deviceId } = requestSessionDto;
    const query = `@deviceId:{${escapeHyphens(deviceId)}}`;
    const sessionExists = await this.redisClient.ft.search(
      REDIS_INDEX_NAME.pumpuang.session,
      query,
    );

    if (sessionExists.total > 0) {
      for (const session of sessionExists.documents) {
        await this.redisClient.json.del(session.id);
      }
    }

    const sessionId = randomUUID();
    const tempId = randomUUID();
    const hashedSessionId = generateHmacSha256Hash(
      sessionId,
      this.configService.get<string>(GLOBAL_CONFIG.SESSION_SECRET),
    );

    const session = {
      deviceId,
      hashedSessionId,
      tempId,
    };

    const cacheKey = CACHE_KEY.pumpuang.session(sessionId);

    await this.redisClient.json.set(cacheKey, '$', session);
    await this.redisClient.expire(cacheKey, CONFIG.SESSION_CACHE_TTL);

    return { sessionId };
  }

  private async checkPhoneNumberExistsInPumpuangOrThrow(phoneNumber): Promise<PumpuangDocument> {
    const pumpuangPhoneNumberExists = await this.pumpuangRepository.findOne({
      phoneNumber,
    });

    if (pumpuangPhoneNumberExists) {
      throw new ErrorException(CODES.TEC_074);
    }

    return pumpuangPhoneNumberExists;
  }

  private async createPumpuangSessionIndex(): Promise<void> {
    const indexLists = await this.redisClient.ft._list();
    const indexName = REDIS_INDEX_NAME.pumpuang.session;
    const pumpuangSessionIndexExists = indexLists.includes(indexName);

    if (pumpuangSessionIndexExists) {
      await this.redisClient.ft.dropIndex(indexName);
    }

    await this.redisClient.ft.create(
      indexName,
      {
        '$.deviceId': {
          type: SchemaFieldTypes.TAG,
          AS: 'deviceId',
        },
      },
      {
        ON: 'JSON',
        PREFIX: CACHE_KEY.pumpuang.session(''),
      },
    );
  }
}
