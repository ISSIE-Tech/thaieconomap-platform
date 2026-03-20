import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

import { FavoriteType, PumpuangStatus, SubmissionStatus } from '@thaieconomap/contracts';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-yet';
import { Express } from 'express';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { RedisClientType, SchemaFieldTypes } from 'redis';

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
  prettyObjectString,
  transformOpeningToDisplayOpening,
} from '../../../shared/utils';
import { NotificationService } from '../../notifications/services';
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
  private redisClient: RedisClientType;
  private readonly bypassPumpuangPhoneNumber = this.configService.get<string>(
    GLOBAL_CONFIG.BYPASS_PUMPUANG_PHONE_NUMBER,
  );
  private readonly bypassPumpuangOtp = this.configService.get<string>(
    GLOBAL_CONFIG.BYPASS_PUMPUANG_OTP,
  );

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
  ) {
    this.redisClient = (this.cacheManager.store as RedisStore).client;
  }

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
      return {
        refno: otpExists.refno,
        expiredAt: new Date(otpExists.expiredAt),
      };
    }

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

    return otpResponse;
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
      throw new ErrorException(CODES.TEC_076);
    }

    await this.thaiBulkSmsService.verifyOtp(otpExists.token, pin);

    await this.cacheManager.del(otpCacheKey);

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
      };
    }

    const today = new Date().getDay();
    const opening = pumpuang.opening[today];
    const currentMiniutes = getCurrentMiniutesPassSinceMidnight(new Date());

    if (!opening.enable || !opening.hours.length) {
      return;
    }

    if (currentMiniutes < opening.hours[0].open) {
      return;
    }

    const lastOpeningTime = opening.hours.length - 1;

    if (currentMiniutes > opening.hours[lastOpeningTime].close) {
      await this.deletePumpuangLocationFromCache(pumpuang._id.toString());

      return;
    }

    await this.updateLocationCache(pumpuang, opening, currentMiniutes, locationDto);

    return {
      location: locationDto,
      status: pumpuang.status,
    };
  }

  async getPumpuangRoute(pumpuangId: string): Promise<IGetPumpuangRouteResponse> {
    await this.getPumpuangById(undefined, pumpuangId);

    const result = await this.redisClient.json.get(CACHE_KEY.pumpuang.location(pumpuangId));

    return result as unknown as IGetPumpuangRouteResponse;
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
  async autoCloseExpiredTracking(): Promise<void> {
    const ctx = `${PumpuangsService.name}-${this.autoCloseExpiredTracking.name}`;
    const runningPumpuangs = await this.pumpuangRepository.find({
      status: PumpuangStatus.RUNNING,
    });

    if (!runningPumpuangs.length) {
      return;
    }

    const today = new Date().getDay();
    const currentMinutes = getCurrentMiniutesPassSinceMidnight(new Date());

    for (const pumpuang of runningPumpuangs) {
      const opening = pumpuang.opening[today];
      const shouldClose =
        !opening.enable ||
        !opening.hours.length ||
        currentMinutes > opening.hours[opening.hours.length - 1].close;

      if (!shouldClose) {
        continue;
      }

      this.logger.debug(`{${ctx}} auto-closing pumpuang ${pumpuang._id}`);

      await this.stopPumpuangRiderTracking(pumpuang);

      this.notificationService
        .sendToPumpuang(
          pumpuang._id.toString(),
          'ปิดการติดตามอัตโนมัติ',
          'ระบบปิดการติดตามตำแหน่งรถปั่นเปี๊ยงอัตโนมัติเนื่องจากถึงเวลาปิดแล้ว',
        )
        .catch(err => this.logger.error(`FCM auto-close notification error: ${err.message}`));
    }
  }

  private async updateLocationCache(
    pumpuang: PumpuangDocument,
    opening: Opening,
    currentMiniutes: number,
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

    const history = locationData
      ? locationData.history
      : Array.from({ length: opening.hours.length }).map(() => []);

    const currentHistoryIndex = opening.hours.findIndex(
      hour => currentMiniutes >= hour.open && currentMiniutes <= hour.close,
    );

    if (currentHistoryIndex === -1) {
      return;
    }

    const { longitude, latitude } = locationDto.location.coords;
    const formattedLocation = `${longitude},${latitude}`;
    const formattedHistory: IPumpuangHistory = {
      location: formattedLocation,
      trackedAt: new Date(),
    };

    const currentLocation = {
      ...locationDto,
      location: formattedLocation,
    };

    if (!history[currentHistoryIndex]) {
      history[currentHistoryIndex] = [];
    }

    history[currentHistoryIndex].push(JSON.stringify(formattedHistory));

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
      .sendToPumpuang(pumpuangId, 'เริ่มส่งตำแหน่งแล้ว', 'ไรเดอร์เริ่มส่งตำแหน่งของรถปั่นเปี๊ยงแล้ว')
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
