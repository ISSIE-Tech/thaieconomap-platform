import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

import { FavoriteType, PumpuangStatus, SubmissionStatus } from '@thaieconomap/contracts';
import { Cache } from 'cache-manager';
import { Express } from 'express';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { RedisClientType, SchemaFieldTypes } from 'redis';

import { REDIS_CLIENT } from '../../../shared/redis';

import { ErrorException } from '../../../common/exceptions';
import { CONFIG } from '../../../config';
import { AdditionalImageService } from '../../../modules/additional-image';
import { AuthService } from '../../../modules/auth/auth.service';
import { ThaiBulkSmsService } from '../../../modules/externals/services/thaibulk-sms.service';
import { MinioClientService } from '../../../modules/minio-client/minio-client.service';
import { FavoriteDocument } from '../../../modules/users/schemas';
import { FavoriteService } from '../../../modules/users/services';
import {
  CACHE_KEY,
  CODES,
  GLOBAL_CONFIG,
  MINIO_FOLDER,
  PUMPUANG_FILE_POLICY,
  REDIS_INDEX_NAME,
} from '../../../shared/constants';
import {
  IGetPumpuangRouteResponse,
  IGetTinyPumpuangResponse,
  IOtpCache,
  IPaginationQuery,
  IPaginationResponse,
  IPumpuangAuthResponse,
  IPumpuangHistory,
  IPumpuangLocationCache,
  IPumpuangLocationTrackingResponse,
  IPumpuangRequestOtpResponse,
  IPumpuangStatus,
  IUser,
} from '../../../shared/interfaces';
import { ICredentials } from '../../../shared/interfaces/token.interface';
import { Opening } from '../../../shared/schemas/opening.schema';
import {
  generateRandomString,
  generateSha256Hash,
  getCurrentMiniutesPassSinceMidnight,
  getTodayOpening,
  prettyObjectString,
  transformOpeningToDisplayOpening,
} from '../../../shared/utils';
import { NotificationService } from '../../notifications/services';
import { OtpLogService } from '../../otp-logs/services';
import {
  CreatePumpuangDto,
  GetPumpuangTinyQueryDto,
  GetPumpuangsQueryDto,
  PumpuangLocationDto,
  RequestOtpDto,
  UpdatePumpuangDto,
  VerifyOtpDto,
} from '../dto';
import {
  DeletedPumpuangRepository,
  PumpuangLocationRepository,
  PumpuangRepository,
} from '../repositories';
import { PumpuangDocument } from '../schemas';

import { LocationAnalyticsService } from './location-analytics.service';

@Injectable()
export class PumpuangsService implements OnModuleInit {
  private basePopulation = [
    { path: 'types' },
    { path: 'createdBy', select: '_id authId' },
    { path: 'lastModifiedBy', select: '_id authId' },
    { path: 'approvedBy', select: '_id authId' },
  ];
  private readonly logger: Logger = new Logger(PumpuangsService.name);
  private readonly bypassPumpuangPhoneNumber = this.configService.get<string>(
    GLOBAL_CONFIG.BYPASS_PUMPUANG_PHONE_NUMBER,
  );
  private readonly bypassPumpuangOtp = this.configService.get<string>(
    GLOBAL_CONFIG.BYPASS_PUMPUANG_OTP,
  );

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
    private readonly pumpuangRepository: PumpuangRepository,
    private readonly additionalImageService: AdditionalImageService,
    private readonly minioClientService: MinioClientService,
    private readonly favoriteService: FavoriteService,
    private readonly deletedPumpuangRepository: DeletedPumpuangRepository,
    private readonly pumpuangLocationRepository: PumpuangLocationRepository,
    private readonly thaiBulkSmsService: ThaiBulkSmsService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly locationAnalyticsService: LocationAnalyticsService,
    private readonly notificationService: NotificationService,
    private readonly otpLogService: OtpLogService,
  ) {}

  async onModuleInit() {
    await this.createPumpuangLocationIndex();
  }

  async getOne(
    filterQuery: FilterQuery<PumpuangDocument>,
    projection?: ProjectionType<PumpuangDocument>,
    options?: QueryOptions<PumpuangDocument>,
  ): Promise<PumpuangDocument> {
    return this.pumpuangRepository.findOne(filterQuery, projection, options);
  }

  async getPumpuang(
    getPumpuangQueryDto: GetPumpuangsQueryDto,
  ): Promise<IPaginationResponse<PumpuangDocument>> {
    const ctx = `${PumpuangsService.name}-${this.getPumpuang.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        getPumpuangQueryDto,
      })}`,
    );

    const query: IPaginationQuery<PumpuangDocument> = getPumpuangQueryDto;

    if (query?.types) {
      query.types = { $in: query.types };
    }

    this.logger.verbose(
      `{${ctx}} (find pending pumpuang by query) query:\n${prettyObjectString({
        query,
      })}`,
    );

    return this.pumpuangRepository.findWithPagination(query, ['name'], {}, this.basePopulation);
  }

  async getAllPumpuang(): Promise<PumpuangDocument[]> {
    return this.pumpuangRepository.find({}, undefined, { populate: this.basePopulation });
  }

  async getAllTinyPumpuangByQuery(
    getPumpuangTinyQueryDto: GetPumpuangTinyQueryDto,
  ): Promise<IGetTinyPumpuangResponse[]> {
    const ctx = `${PumpuangsService.name}-${this.getAllTinyPumpuangByQuery.name}`;

    this.logger.debug(`{${ctx}} (called)`);

    let query = '';

    const { latitude, longitude, types } = getPumpuangTinyQueryDto;

    if (types?.length) {
      query += `@types:{${types.join('|')}}`;
    }

    if (latitude && longitude) {
      query += `@location:[${longitude} ${latitude} ${CONFIG.MAX_DISTANCE_METERS} m]`;
    }

    if (!query.length) {
      query = '*';
    }

    this.logger.verbose(
      `{${ctx}} (redis query) data:\n${prettyObjectString({
        query,
      })}`,
    );

    const result = await this.redisClient.ft.search(REDIS_INDEX_NAME.pumpuang.location, query);
    const data = result.documents.map(document => ({
      _id: document.value._id,
      current: document.value.current,
    }));

    return data as unknown as IGetTinyPumpuangResponse[];
  }

  async createPumpuang(
    user: IUser,
    createPumpuangDto: CreatePumpuangDto,
    image: Express.Multer.File,
  ): Promise<PumpuangDocument> {
    const ctx = `${PumpuangsService.name}-${this.createPumpuang.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        createPumpuangDto,
      })}`,
    );

    const pumpuangPhoneNumberExists = await this.pumpuangRepository.findOne({
      phoneNumber: createPumpuangDto.phoneNumber,
    });

    if (pumpuangPhoneNumberExists) {
      throw new ErrorException(CODES.TEC_074);
    }

    if (createPumpuangDto.additionalImageUrl) {
      this.additionalImageService.checkAdditionalImagePermission(
        user._id,
        createPumpuangDto.additionalImageUrl,
        [],
      );

      createPumpuangDto.additionalImageUrl = await this.additionalImageService.moveAdditionalImage(
        user._id,
        createPumpuangDto.additionalImageUrl,
        MINIO_FOLDER.pumpuang,
      );
    }

    const uploadedImage = await this.minioClientService.upload(MINIO_FOLDER.pumpuang, image);
    const displayOpening = transformOpeningToDisplayOpening(createPumpuangDto.opening);
    const pumpuang = {
      ...createPumpuangDto,
      imageUrl: uploadedImage,
      createdBy: user._id,
      lastModifiedBy: user._id,
      approvedBy: user._id,
      submissionStatus: SubmissionStatus.ACCEPTED,
      displayOpening,
    };

    this.logger.verbose(
      `{${ctx}} (create pumpuang) data:\n${prettyObjectString({
        pumpuang,
      })}`,
    );

    return this.pumpuangRepository.create(pumpuang);
  }

  async deletePumpuang(user: IUser, pumpuangId: string): Promise<PumpuangDocument> {
    const ctx = `${PumpuangsService.name}-${this.deletePumpuang.name}`;

    this.logger.debug(
      `{${ctx}}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pumpuangId,
      })}`,
    );

    const pumpuang = await this.getPumpuangById(undefined, pumpuangId);
    const imageUrl = await this.minioClientService.moveFile(
      pumpuang.imageUrl,
      `${MINIO_FOLDER.bin}/${MINIO_FOLDER.pumpuang}`,
    );

    if (!imageUrl) {
      throw new ErrorException(CODES.TEC_054);
    }

    const additionalImageUrl = pumpuang.additionalImageUrl?.length
      ? await this.minioClientService.moveFiles(
          pumpuang.additionalImageUrl,
          MINIO_FOLDER.pumpuang,
          `${MINIO_FOLDER.bin}/${MINIO_FOLDER.pumpuang}`,
        )
      : undefined;

    const deletedPumpuang = {
      ...pumpuang,
      deletedBy: user._id,
      submissionStatus: SubmissionStatus.REMOVED,
      imageUrl,
      additionalImageUrl,
    };

    this.logger.verbose(
      `{${ctx}} (create deleted pumpuang when delete pumpuang) data:\n${prettyObjectString({
        deletedPumpuang,
      })}`,
    );

    await this.deletedPumpuangRepository.create(deletedPumpuang);

    await this.favoriteService.deleteFavoriteByTargetId([pumpuang._id], FavoriteType.PUMPUANGS);

    return this.pumpuangRepository.findByIdAndDelete(pumpuangId);
  }

  async uploadAdditionalImage(user: IUser, images: Array<Express.Multer.File>): Promise<string[]> {
    this.logger.debug(
      `{${PumpuangsService.name}-${this.uploadAdditionalImage.name}} (called)\
      \n[param] ${prettyObjectString({
        user,
      })}`,
    );

    return this.additionalImageService.uploadAdditionalImage(
      user._id,
      images,
      PUMPUANG_FILE_POLICY.type,
    );
  }

  async deleteAdditionalImageUrl(
    user: IUser,
    pumpuangId: string,
    fileName: string,
  ): Promise<PumpuangDocument> {
    this.logger.debug(
      `{${PumpuangsService.name}-${this.deleteAdditionalImageUrl.name}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pumpuangId,
        fileName,
      })}`,
    );

    const pumpuang = await this.getPumpuangById(undefined, pumpuangId);

    await this.additionalImageService.deleteAdditionalImageUrl(
      fileName,
      pumpuang.additionalImageUrl,
    );

    return this.pumpuangRepository.findByIdAndUpdate(pumpuangId, {
      $pull: { additionalImageUrl: fileName },
    });
  }

  async getPumpuangById(user: IUser, pumpuangId: string): Promise<PumpuangDocument> {
    this.logger.debug(
      `{${PumpuangsService.name}-${this.getPumpuangById.name}} (called)\
      \n[param] ${prettyObjectString({
        pumpuangId,
      })}`,
    );

    const pumpuang = await this.pumpuangRepository.findById(
      pumpuangId,
      {},
      { populate: this.basePopulation },
    );

    if (!pumpuang) {
      throw new ErrorException(CODES.TEC_064);
    }

    pumpuang.isFavorite = false;

    if (user) {
      pumpuang.isFavorite = await this.favoriteService.isFavoriteTheTarget(user, pumpuang);
    }

    return pumpuang;
  }

  async updatePumpuang(
    user: IUser,
    pumpuangId: string,
    updatePumpuangDto: UpdatePumpuangDto,
    image: Express.Multer.File,
  ): Promise<PumpuangDocument> {
    const ctx = `${PumpuangsService.name}-${this.updatePumpuang.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pumpuangId,
        updatePumpuangDto,
      })}`,
    );

    const pumpuang = await this.getPumpuangById(undefined, pumpuangId);
    const pumpuangPhoneNumberExists = await this.pumpuangRepository.findOne({
      phoneNumber: updatePumpuangDto?.phoneNumber,
    });

    if (
      pumpuangPhoneNumberExists &&
      pumpuangPhoneNumberExists._id.toString() !== pumpuang._id.toString()
    ) {
      throw new ErrorException(CODES.TEC_074);
    }

    if (updatePumpuangDto.additionalImageUrl) {
      updatePumpuangDto.additionalImageUrl =
        await this.additionalImageService.getUpdateAdditionalImageUrlQuery(
          user,
          updatePumpuangDto.additionalImageUrl,
          pumpuang.additionalImageUrl,
          MINIO_FOLDER.pumpuang,
        );
    }

    const updatePumpuang = {
      ...updatePumpuangDto,
      imageUrl: image
        ? await this.minioClientService.replaceFile(MINIO_FOLDER.pumpuang, image, pumpuang.imageUrl)
        : pumpuang.imageUrl,
      displayOpening: updatePumpuangDto.opening
        ? transformOpeningToDisplayOpening(updatePumpuangDto.opening)
        : pumpuang.displayOpening,
      lastModifiedBy: user._id,
      lastModifiedAt: Date.now(),
    };

    this.logger.verbose(
      `{${ctx}} (update pumpuang) data:\n${prettyObjectString({
        updatePumpuang,
      })}`,
    );

    return this.pumpuangRepository.findByIdAndUpdate(pumpuangId, updatePumpuang);
  }

  async favoritePumpuang(user: IUser, pumpuangId: string): Promise<FavoriteDocument> {
    this.logger.debug(
      `{${PumpuangsService.name}-${this.favoritePumpuang.name}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pumpuangId,
      })}`,
    );

    const pumpuang = await this.getPumpuangById(undefined, pumpuangId);

    return this.favoriteService.favorite(user, pumpuang, FavoriteType.PUMPUANGS);
  }

  async unfavoritePumpuang(user: IUser, pumpuangId: string): Promise<void> {
    this.logger.debug(
      `{${PumpuangsService.name}-${this.unfavoritePumpuang.name}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pumpuangId,
      })}`,
    );

    const pumpuang = await this.getPumpuangById(undefined, pumpuangId);

    return this.favoriteService.unfavorite(user, pumpuang, FavoriteType.PUMPUANGS);
  }

  async updatePumpuangRefreshToken(
    pumpuangId: string,
    refreshToken: string,
  ): Promise<PumpuangDocument> {
    const hashedToken = await generateSha256Hash(refreshToken);

    return this.pumpuangRepository.findByIdAndUpdate(
      pumpuangId,
      {
        refreshToken: hashedToken,
      },
      {
        projection: {
          refreshToken: 0,
        },
      },
    );
  }

  async revokeRefreshToken(pumpuangId: string): Promise<PumpuangDocument> {
    return this.pumpuangRepository.findByIdAndUpdate(pumpuangId, { $unset: { refreshToken: 1 } });
  }

  async getPumpuangByPhoneNumberOrThrow(phoneNumber: string): Promise<PumpuangDocument> {
    this.logger.debug(
      `{${PumpuangsService.name}-${this.getPumpuangByPhoneNumberOrThrow.name}} (called)\
      \n[param] ${prettyObjectString({
        phoneNumber,
      })}`,
    );

    const pumpuang = await this.pumpuangRepository.findOne({ phoneNumber });

    if (!pumpuang) {
      throw new ErrorException(CODES.TEC_064);
    }

    return pumpuang;
  }

  async pumpuangRequestOtp(requestOtpDto: RequestOtpDto): Promise<IPumpuangRequestOtpResponse> {
    const { phoneNumber } = requestOtpDto;
    const pumpuangExists = await this.getPumpuangByPhoneNumberOrThrow(phoneNumber);

    // ================ Bypass otp for apple review ================
    if (phoneNumber === this.bypassPumpuangPhoneNumber) {
      return {
        refno: `${generateRandomString(5)}`,
        expiredAt: new Date(),
      };
    }

    const otpCacheKey = CACHE_KEY.pumpuang.otp(pumpuangExists._id.toString());
    const otpExists = await this.cacheManager.get<IOtpCache>(otpCacheKey);
    const now = new Date();
    const isOtpExpired = now > new Date(otpExists?.expiredAt);

    if (otpExists && !isOtpExpired) {
      await this.otpLogService.logRequestSuccess(
        phoneNumber,
        pumpuangExists._id.toString(),
        pumpuangExists.owner,
        otpExists.refno,
      );

      return {
        refno: otpExists.refno,
        expiredAt: new Date(otpExists.expiredAt),
      };
    }

    try {
      const requestOtp = await this.thaiBulkSmsService.requestOtp(phoneNumber);
      const expiredAt = new Date(now.getTime() + CONFIG.OTP_EXPIRE_AT);
      const otpResponse = {
        refno: requestOtp.refno,
        expiredAt,
      };

      await this.cacheManager.set(
        otpCacheKey,
        {
          ...otpResponse,
          token: requestOtp.token,
        },
        CONFIG.OTP_CACHE_TTL,
      );

      await this.otpLogService.logRequestSuccess(
        phoneNumber,
        pumpuangExists._id.toString(),
        pumpuangExists.owner,
        requestOtp.refno,
      );

      return otpResponse;
    } catch (error) {
      await this.otpLogService.logRequestFailure(
        phoneNumber,
        pumpuangExists._id.toString(),
        pumpuangExists.owner,
        error.message,
      );
      throw error;
    }
  }

  async pumpuangVerifyOtp(verifyOtpDto: VerifyOtpDto): Promise<IPumpuangAuthResponse> {
    const { phoneNumber, pin } = verifyOtpDto;
    const { approvedBy, lastModifiedBy, refreshToken, ...pumpuangExists } =
      await this.getPumpuangByPhoneNumberOrThrow(phoneNumber);

    const pumpuangId = pumpuangExists._id.toString();

    // ================ Bypass otp for apple review ================
    if (phoneNumber === this.bypassPumpuangPhoneNumber && pin === this.bypassPumpuangOtp) {
      return {
        credentials: await this.generatePumpuangCredentials(pumpuangId),
        profile: pumpuangExists as PumpuangDocument,
      };
    }

    const otpCacheKey = CACHE_KEY.pumpuang.otp(pumpuangId);
    const otpExists = await this.cacheManager.get<IOtpCache>(otpCacheKey);

    if (!otpExists) {
      await this.otpLogService.logVerifyFailure(
        phoneNumber,
        pumpuangId,
        pumpuangExists.owner,
        'OTP not found in cache',
      );
      throw new ErrorException(CODES.TEC_076);
    }

    try {
      await this.thaiBulkSmsService.verifyOtp(otpExists.token, pin);
    } catch (error) {
      await this.otpLogService.logVerifyFailure(
        phoneNumber,
        pumpuangId,
        pumpuangExists.owner,
        error.message,
      );
      throw error;
    }

    await this.cacheManager.del(otpCacheKey);
    await this.otpLogService.logVerifySuccess(phoneNumber, pumpuangId, pumpuangExists.owner);

    return {
      credentials: await this.generatePumpuangCredentials(pumpuangId),
      profile: pumpuangExists as PumpuangDocument,
    };
  }

  async generatePumpuangCredentials(pumpuangId: string): Promise<ICredentials> {
    const credentials = this.authService.generateCredential(pumpuangId);

    this.logger.debug(
      `{${PumpuangsService.name}-${this.generatePumpuangCredentials.name}} (called)\
      \n[param] ${prettyObjectString({
        pumpuangId,
        credentials,
      })}`,
    );

    await this.updatePumpuangRefreshToken(pumpuangId, credentials.refreshToken);

    return credentials;
  }

  async startPumpuangRiderTracking(pumpuang: PumpuangDocument): Promise<IPumpuangStatus> {
    const updatedPumpuang = await this.pumpuangRepository.findByIdAndUpdate(
      pumpuang._id.toString(),
      {
        status: PumpuangStatus.RUNNING,
      },
    );

    return {
      status: updatedPumpuang.status,
    };
  }

  async stopPumpuangRiderTracking(pumpuang: PumpuangDocument): Promise<IPumpuangStatus> {
    await this.deletePumpuangLocationFromCache(pumpuang._id.toString());

    const updatedPumpuang = await this.pumpuangRepository.findByIdAndUpdate(
      pumpuang._id.toString(),
      {
        status: PumpuangStatus.INACTIVE,
      },
    );

    return {
      status: updatedPumpuang.status,
    };
  }

  async forceStopPumpuangTracking(pumpuangId: string): Promise<IPumpuangStatus> {
    const pumpuang = await this.pumpuangRepository.findById(pumpuangId);

    if (!pumpuang) {
      throw new ErrorException(CODES.TEC_064);
    }

    if (pumpuang.status !== PumpuangStatus.RUNNING) {
      throw new ErrorException(CODES.TEC_077);
    }

    await this.deletePumpuangLocationFromCache(pumpuangId);

    const updatedPumpuang = await this.pumpuangRepository.findByIdAndUpdate(pumpuangId, {
      status: PumpuangStatus.INACTIVE,
    });

    return { status: updatedPumpuang.status };
  }

  async pumpuangRiderTracking(
    pumpuang: PumpuangDocument,
    locationDto: PumpuangLocationDto,
  ): Promise<IPumpuangLocationTrackingResponse> {
    const ctx = `${PumpuangsService.name}-${this.pumpuangRiderTracking.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        _id: pumpuang._id,
        locationDto,
      })}`,
    );

    if (pumpuang.status !== PumpuangStatus.RUNNING) {
      return {
        location: locationDto,
        status: pumpuang.status,
        background_geolocation: ['stop'],
      };
    }

    await this.updateLocationCache(pumpuang, locationDto);

    return {
      location: locationDto,
      status: pumpuang.status,
      background_geolocation: [],
    };
  }

  async getPumpuangRoute(pumpuangId: string): Promise<IGetPumpuangRouteResponse[]> {
    await this.getPumpuangById(undefined, pumpuangId);

    const results: IGetPumpuangRouteResponse[] = [];

    // Include active tracking session from Redis if exists
    const cachedResult = await this.redisClient.json.get(CACHE_KEY.pumpuang.location(pumpuangId));

    if (cachedResult) {
      results.push(cachedResult as unknown as IGetPumpuangRouteResponse);
    }

    // Include all historical tracking records from MongoDB
    const persistedLocations = await this.pumpuangLocationRepository.find(
      { pumpuangId },
      {},
      { sort: { createdAt: -1 } },
    );

    for (const record of persistedLocations) {
      results.push({
        _id: record._id?.toString(),
        current: record.current,
        history: (record.history || [])
          .map(histories =>
            (histories || [])
              .filter(h => h?.location)
              .map(h => JSON.stringify({ location: h.location, trackedAt: h.trackedAt })),
          )
          .filter(histories => histories.length > 0),
        types: record.types,
      } as unknown as IGetPumpuangRouteResponse);
    }

    return results;
  }

  private async deletePumpuangLocationFromCache(pumpuangId: string): Promise<void> {
    const cacheKey = CACHE_KEY.pumpuang.location(pumpuangId);
    const location = (await this.redisClient.json.get(
      cacheKey,
    )) as unknown as IGetPumpuangRouteResponse;

    if (!location) {
      return;
    }

    delete location._id;

    await this.pumpuangLocationRepository.create({
      pumpuangId,
      ...location,
      history: location.history.map((histories: string[]) =>
        histories.map((history: string) => {
          const { location, trackedAt } = JSON.parse(history);

          return {
            location,
            trackedAt: new Date(trackedAt),
          };
        }),
      ),
    });

    await this.redisClient.json.del(cacheKey);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async sendOpenTimeNotifications(): Promise<void> {
    const ctx = `${PumpuangsService.name}-${this.sendOpenTimeNotifications.name}`;

    try {
      const now = new Date();
      const currentMinutes = Math.floor(getCurrentMiniutesPassSinceMidnight(now));
      const dateStr = now.toISOString().slice(0, 10);

      const pumpuangs = await this.pumpuangRepository.find({
        submissionStatus: SubmissionStatus.ACCEPTED,
      });

      for (const pumpuang of pumpuangs) {
        const opening = getTodayOpening(pumpuang.opening, now);

        if (!opening || !opening.enable || !opening.hours.length) {
          continue;
        }

        if (currentMinutes !== opening.hours[0].open) {
          continue;
        }

        const pumpuangId = pumpuang._id.toString();
        const cacheKey = CACHE_KEY.pumpuang.notifOpen(pumpuangId, dateStr);
        const alreadySent = await this.redisClient.get(cacheKey);

        if (alreadySent) {
          this.logger.verbose(`{${ctx}} [${pumpuangId}] open-time notification already sent today`);
          continue;
        }

        try {
          await this.notificationService.sendToPumpuang(
            pumpuangId,
            'ถึงเวลาเปิดร้านแล้ว',
            'โปรดส่งตำแหน่งรถพุ่มพวง',
            undefined,
            'open-time-reminder',
          );
          await this.redisClient.set(cacheKey, '1', { EX: 86400 });
          this.logger.debug(`{${ctx}} [${pumpuangId}] open-time notification sent`);
        } catch (err) {
          this.logger.error(
            `{${ctx}} [${pumpuangId}] failed to send open-time notification: ${err.message}`,
          );
        }
      }
    } catch (err) {
      this.logger.error(`{${ctx}} error: ${err.message}`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async sendCloseTimeNotifications(): Promise<void> {
    const ctx = `${PumpuangsService.name}-${this.sendCloseTimeNotifications.name}`;

    try {
      const now = new Date();
      const currentMinutes = Math.floor(getCurrentMiniutesPassSinceMidnight(now));
      const dateStr = now.toISOString().slice(0, 10);

      const runningPumpuangs = await this.pumpuangRepository.find({
        status: PumpuangStatus.RUNNING,
      });

      for (const pumpuang of runningPumpuangs) {
        const opening = getTodayOpening(pumpuang.opening, now);

        if (!opening || !opening.enable || !opening.hours.length) {
          continue;
        }

        const lastCloseTime = opening.hours[opening.hours.length - 1].close;
        const pumpuangId = pumpuang._id.toString();

        if (currentMinutes === lastCloseTime) {
          const cacheKey = CACHE_KEY.pumpuang.notifClose(pumpuangId, dateStr);
          const alreadySent = await this.redisClient.get(cacheKey);

          if (alreadySent) {
            this.logger.verbose(
              `{${ctx}} [${pumpuangId}] close-time notification already sent today`,
            );
          } else {
            try {
              await this.notificationService.sendToPumpuang(
                pumpuangId,
                'ถึงเวลาหยุดวิ่งแล้ว',
                'โปรดปิดการส่งตำแหน่งรถพุ่มพวง',
                undefined,
                'close-time-reminder',
              );
              await this.redisClient.set(cacheKey, '1', { EX: 86400 });
              this.logger.debug(`{${ctx}} [${pumpuangId}] close-time notification sent`);
            } catch (err) {
              this.logger.error(
                `{${ctx}} [${pumpuangId}] failed to send close-time notification: ${err.message}`,
              );
            }
          }
        }

        if (currentMinutes === lastCloseTime + 60) {
          const followupKey = CACHE_KEY.pumpuang.notifCloseFollowup(pumpuangId, dateStr);
          const alreadySent = await this.redisClient.get(followupKey);

          if (alreadySent) {
            this.logger.verbose(
              `{${ctx}} [${pumpuangId}] close-time follow-up notification already sent today`,
            );
          } else {
            try {
              await this.notificationService.sendToPumpuang(
                pumpuangId,
                'แจ้งเตือนเลยเวลาวิ่งรถพุ่มพวง',
                'กรุณาปิดการส่งตำแหน่งรถพุ่มพวง',
                undefined,
                'close-time-reminder-followup',
              );
              await this.redisClient.set(followupKey, '1', { EX: 86400 });
              this.logger.debug(`{${ctx}} [${pumpuangId}] close-time follow-up notification sent`);
            } catch (err) {
              this.logger.error(
                `{${ctx}} [${pumpuangId}] failed to send close-time follow-up notification: ${err.message}`,
              );
            }
          }
        }

        if (currentMinutes === lastCloseTime + 120) {
          const followup2Key = CACHE_KEY.pumpuang.notifCloseFollowup2(pumpuangId, dateStr);
          const alreadySent = await this.redisClient.get(followup2Key);

          if (alreadySent) {
            this.logger.verbose(
              `{${ctx}} [${pumpuangId}] auto-close notification already sent today`,
            );
          } else {
            try {
              await this.stopPumpuangRiderTracking(pumpuang);
              this.logger.debug(`{${ctx}} [${pumpuangId}] tracking auto-closed`);
              await this.notificationService.sendToPumpuang(
                pumpuangId,
                'ปิดการติดตามอัตโนมัติ',
                'ระบบปิดการติดตามตำแหน่งให้อัตโนมัติเนื่องจากเลยเวลาปิดร้าน',
                undefined,
                'close-time-auto-close',
              );
              await this.redisClient.set(followup2Key, '1', { EX: 86400 });
              this.logger.debug(`{${ctx}} [${pumpuangId}] auto-close notification sent`);
            } catch (err) {
              this.logger.error(
                `{${ctx}} [${pumpuangId}] failed to auto-close or send notification: ${err.message}`,
              );
            }
          }
        }
      }
    } catch (err) {
      this.logger.error(`{${ctx}} error: ${err.message}`);
    }
  }

  @Cron('50 23 * * *', { timeZone: 'Asia/Bangkok' })
  async forceCloseAllTrackingDaily(): Promise<void> {
    const ctx = `${PumpuangsService.name}-${this.forceCloseAllTrackingDaily.name}`;

    try {
      const runningPumpuangs = await this.pumpuangRepository.find({
        status: PumpuangStatus.RUNNING,
      });

      if (!runningPumpuangs.length) {
        this.logger.verbose(`{${ctx}} no running pumpuangs to close`);
        return;
      }

      this.logger.debug(
        `{${ctx}} force-closing ${runningPumpuangs.length} running pumpuangs at 23:50`,
      );

      for (const pumpuang of runningPumpuangs) {
        const pumpuangId = pumpuang._id.toString();

        try {
          await this.stopPumpuangRiderTracking(pumpuang);
          await this.notificationService.sendToPumpuang(
            pumpuangId,
            'ปิดการติดตามอัตโนมัติ',
            'ระบบปิดการติดตามตำแหน่งอัตโนมัติเนื่องจากสิ้นสุดวัน',
          );
          this.logger.debug(`{${ctx}} [${pumpuangId}] daily force-close complete`);
        } catch (err) {
          this.logger.error(
            `{${ctx}} [${pumpuangId}] failed to force-close or notify: ${err.message}`,
          );
        }
      }
    } catch (err) {
      this.logger.error(`{${ctx}} error: ${err.message}`);
    }
  }

  private async updateLocationCache(
    pumpuang: PumpuangDocument,
    locationDto: PumpuangLocationDto,
  ): Promise<void> {
    const ctx = `${PumpuangsService.name}-${this.updateLocationCache.name}`;
    const cacheKey = CACHE_KEY.pumpuang.location(pumpuang._id.toString());
    const locationData = (await this.redisClient.json.get(
      cacheKey,
    )) as unknown as IPumpuangLocationCache;

    if (!locationData) {
      this.notifyFirstLocation(pumpuang._id.toString());
    }

    const history: string[][] = locationData ? locationData.history : [[]];

    const { longitude, latitude } = locationDto.location.coords;
    const formattedLocation = `${longitude},${latitude}`;
    const formattedHistory: IPumpuangHistory = {
      location: formattedLocation,
      trackedAt: new Date(),
    };

    const currentLocation = {
      location: formattedLocation,
      direction: locationDto.location.coords.heading ?? 0,
      speed: locationDto.location.coords.speed ?? 0,
    };

    if (!history[0]) {
      history[0] = [];
    }

    history[0].push(JSON.stringify(formattedHistory));

    const updateLocation = {
      _id: pumpuang._id,
      current: currentLocation,
      history,
      types: pumpuang.types as unknown as string[],
      lastLocationSent: Date.now(),
    };

    this.logger.verbose(
      `{${ctx}} (update location)\
      \n[param] ${prettyObjectString({ updateLocation })}`,
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.redisClient.json.set(cacheKey, '$', updateLocation as any);

    this.locationAnalyticsService.forwardLocation(pumpuang._id.toString(), locationDto);
  }

  private notifyFirstLocation(pumpuangId: string): void {
    this.notificationService
      .sendToPumpuang(pumpuangId, 'เริ่มส่งตำแหน่งแล้ว', 'ท่านเริ่มส่งตำแหน่งรถพุ่มพวงแล้ว')
      .catch(err => this.logger.error(`FCM first-location notification error: ${err.message}`));
  }

  private async createPumpuangLocationIndex(): Promise<void> {
    const indexLists = await this.redisClient.ft._list();
    const pumpuangLocationIndexExists = indexLists.includes(REDIS_INDEX_NAME.pumpuang.location);

    if (pumpuangLocationIndexExists) {
      await this.redisClient.ft.dropIndex(REDIS_INDEX_NAME.pumpuang.location);
    }

    await this.redisClient.ft.create(
      REDIS_INDEX_NAME.pumpuang.location,
      {
        '$._id': {
          type: SchemaFieldTypes.TEXT,
          AS: '_id',
        },
        '$.types[*]._id': {
          type: SchemaFieldTypes.TAG,
          AS: 'types',
        },
        '$.current.location': {
          type: SchemaFieldTypes.GEO,
          AS: 'location',
        },
        '$.lastLocationSent': {
          type: SchemaFieldTypes.NUMERIC,
          AS: 'lastLocationSent',
        },
      },
      {
        ON: 'JSON',
        PREFIX: CACHE_KEY.pumpuang.location(''),
      },
    );
  }
}
