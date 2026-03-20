import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { FavoriteType, SearchLocation, SubmissionStatus } from '@thaieconomap/contracts';
import { Express } from 'express';
import { FilterQuery, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../../common/exceptions';
import { CONFIG } from '../../../config';
import { AdditionalImageService } from '../../../modules/additional-image';
import { MapService } from '../../../modules/map/map.service';
import { MinioClientService } from '../../../modules/minio-client/minio-client.service';
import { FavoriteDocument } from '../../../modules/users/schemas';
import { FavoriteService } from '../../../modules/users/services';
import { CODES, MINIO_FOLDER, SHARES_FILE_POLICY } from '../../../shared/constants';
import { IPaginationQuery, IPaginationResponse, IUser } from '../../../shared/interfaces';
import {
  checkDistrictPermission,
  createNearQuery,
  getSpanName,
  isManagerUser,
  prettyObjectString,
  transformLatitudeAndLongitudeToGeoJson,
} from '../../../shared/utils';
import { CreateShareDto, GetSharesQueryDto, GetTinySharesQueryDto, UpdateShareDto } from '../dto';
import { DeletedSharesRepository, SharesRepository } from '../repositories';
import { ShareDocument } from '../schemas';

import { ConditionOptionsService } from './condition-options.service';
import { ShareTypesService } from './share-types.service';
import { ShippingOptionsService } from './shipping-options.service';

@Injectable()
export class SharesService {
  private readonly logger: Logger = new Logger(SharesService.name);

  constructor(
    private readonly sharesRepository: SharesRepository,
    private readonly deletedSharesRepository: DeletedSharesRepository,
    private readonly minioClientService: MinioClientService,
    private readonly mapService: MapService,
    private readonly favoriteService: FavoriteService,
    private readonly additionalImageService: AdditionalImageService,

    @Inject(forwardRef(() => ShareTypesService))
    private readonly shareTypesService: ShareTypesService,

    @Inject(forwardRef(() => ConditionOptionsService))
    private readonly conditionOptionsService: ConditionOptionsService,

    @Inject(forwardRef(() => ShippingOptionsService))
    private readonly shippingOptionsService: ShippingOptionsService,
  ) {}

  @Span('Get One Share')
  async getOne(
    filterQuery: FilterQuery<ShareDocument>,
    projection?: ProjectionType<ShareDocument>,
    options?: QueryOptions<ShareDocument>,
  ): Promise<ShareDocument> {
    this.logger.debug(
      `{${SharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
        projection,
        options,
      })}`,
    );

    return this.sharesRepository.findOne(filterQuery, projection, options);
  }

  @Span('Get All Shares')
  async getAllShares(user: IUser): Promise<ShareDocument[]> {
    this.logger.debug(
      `{${SharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        role: user.roles.TEC,
      })}`,
    );

    const filter = isManagerUser(user) ? { district: user.districts } : {};

    return this.sharesRepository.find(
      filter,
      {},
      {
        populate: [
          { path: 'createdBy', select: '_id authId' },
          { path: 'lastModifiedBy', select: '_id authId' },
          { path: 'approvedBy', select: '_id authId' },
          { path: 'types' },
          { path: 'district' },
        ],
      },
    );
  }

  @Span('Get All Tiny Shares By Query')
  async getAllTinySharesByQuery(
    getTinySharesQueryDto: GetTinySharesQueryDto,
  ): Promise<ShareDocument[]> {
    const ctx = `${SharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        getTinySharesQueryDto,
      })}`,
    );

    const { location, latitude, longitude, types, ...query } = getTinySharesQueryDto;
    const projection = {
      name: 1,
      location: 1,
      address: 1,
      imageUrl: 1,
      approvedAt: 1,
      condition: 1,
      createdBy: 0,
    };

    if (location === SearchLocation.NEAR_ME) {
      query['location'] = createNearQuery(
        getTinySharesQueryDto.latitude,
        getTinySharesQueryDto.longitude,
        CONFIG.MAX_DISTANCE_METERS,
        0,
      );
    }

    if (types) {
      query['types'] = { $in: types };
    }

    this.logger.verbose(
      `{${ctx}} (find tiny shares) query:\n${prettyObjectString({
        query,
      })}`,
    );

    return this.sharesRepository.find(query, projection);
  }

  @Span('Get Paginated Shares')
  async getPaginatedShares(
    user: IUser,
    getSharesQueryDto: GetSharesQueryDto,
  ): Promise<IPaginationResponse<ShareDocument>> {
    const ctx = `${SharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        getSharesQueryDto,
      })}`,
    );

    const query: IPaginationQuery<ShareDocument> = getSharesQueryDto;
    const projection = {
      detail: 0,
      moreDetail: 0,
      rejectedAutoDelete: 0,
      rejectedCompletelyDeletedAt: 0,
      requests: 0,
      approvedAt: 0,
      approvedBy: 0,
      lastModifiedBy: 0,
      submissionStatus: 0,
      submissionMessage: 0,
      createdBy: 0,
    };

    if (isManagerUser(user)) {
      query.district = user.districts;
    }

    if (query.types) {
      query.types = { $in: query.types };
    }

    this.logger.verbose(
      `{${ctx}} (find paginate shares) query:\n${prettyObjectString({
        query,
      })}`,
    );

    return this.sharesRepository.findWithPagination(query, ['name'], projection);
  }

  @Span('Get Tiny Share By Id')
  async getTinyShareById(user: IUser, shareId: string): Promise<ShareDocument> {
    this.logger.debug(
      `{${SharesService.name}-${this.getTinyShareById.name}} (called)\
      \n[param] ${prettyObjectString({
        shareId,
      })}`,
    );

    const tinyProjection = {
      requests: 0,
      approvedAt: 0,
      approvedBy: 0,
      lastModifiedBy: 0,
      submissionStatus: 0,
      submissionMessage: 0,
      rejectedAutoDelete: 0,
      rejectedCompletelyDeletedAt: 0,
    };

    const share = await this.getShareById(shareId, tinyProjection);

    share.isFavorite = false;

    if (user) {
      share.isFavorite = await this.favoriteService.isFavoriteTheTarget(user, share);
    }

    return share;
  }

  @Span('Get Share By Id')
  async getShareById(
    shareId: string,
    projection?: ProjectionType<ShareDocument>,
  ): Promise<ShareDocument> {
    this.logger.debug(
      `{${SharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        shareId,
        projection,
      })}`,
    );

    const share = await this.sharesRepository.findById(shareId, projection);

    if (!share) {
      throw new ErrorException(CODES.TEC_023);
    }

    return share;
  }

  @Span('Create Share')
  async createShare(
    user: IUser,
    createShareDto: CreateShareDto,
    image: Express.Multer.File,
  ): Promise<ShareDocument> {
    const ctx = `${SharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        createShareDto,
      })}`,
    );

    this.checkDistrictPermission(user, createShareDto.district);
    await this.checkIfDistrictIdValid(createShareDto.district);
    await this.checkIfShareOptionValid(
      createShareDto.types,
      createShareDto.condition,
      createShareDto.shipping,
    );

    if (createShareDto.additionalImageUrl) {
      this.additionalImageService.checkAdditionalImagePermission(
        user._id,
        createShareDto.additionalImageUrl,
        [],
      );

      createShareDto.additionalImageUrl = await this.additionalImageService.moveAdditionalImage(
        user._id,
        createShareDto.additionalImageUrl,
        MINIO_FOLDER.shares,
      );
    }

    const location = transformLatitudeAndLongitudeToGeoJson(createShareDto.location);
    const uploadedImage = await this.minioClientService.upload(MINIO_FOLDER.shares, image);
    const share = {
      ...createShareDto,
      imageUrl: uploadedImage,
      location,
      submissionStatus: SubmissionStatus.ACCEPTED,
      createdBy: user._id,
      approvedBy: user._id,
      lastModifiedBy: user._id,
    };

    this.logger.verbose(
      `{${ctx}} (create share) data:\n${prettyObjectString({
        share,
      })}`,
    );

    return this.sharesRepository.create(share);
  }

  @Span('Update Share')
  async updateShare(
    user: IUser,
    shareId: string,
    updateShareDto: UpdateShareDto,
    image: Express.Multer.File,
  ): Promise<ShareDocument> {
    const ctx = `${SharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        shareId,
        updateShareDto,
      })}`,
    );

    const share = await this.getShareById(shareId);
    const districtId = share.district._id.toString();

    this.checkDistrictPermission(user, districtId);

    if (updateShareDto.district) {
      await this.checkIfDistrictIdValid(updateShareDto.district);
    }

    await this.checkIfShareOptionValid(
      updateShareDto.types,
      updateShareDto.condition,
      updateShareDto.shipping,
    );

    if (updateShareDto.additionalImageUrl) {
      updateShareDto.additionalImageUrl =
        await this.additionalImageService.getUpdateAdditionalImageUrlQuery(
          user,
          updateShareDto.additionalImageUrl,
          share.additionalImageUrl,
          MINIO_FOLDER.shares,
        );
    }

    const updatedShare = {
      ...updateShareDto,
      imageUrl: image
        ? await this.minioClientService.replaceFile(MINIO_FOLDER.shares, image, share.imageUrl)
        : share.imageUrl,
      lastModifiedAt: Date.now(),
      lastModifiedBy: user._id,
      location: updateShareDto.location
        ? transformLatitudeAndLongitudeToGeoJson(updateShareDto.location)
        : updateShareDto.location,
    };

    this.logger.verbose(
      `{${ctx}} (update share) data:\n${prettyObjectString({
        updatedShare,
      })}`,
    );

    return this.sharesRepository.findByIdAndUpdate(shareId, updatedShare);
  }

  @Span('Favorite Share')
  async favoriteShare(user: IUser, shareId: string): Promise<FavoriteDocument> {
    this.logger.debug(
      `{${SharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
        shareId,
      })}`,
    );

    const share = await this.getShareById(shareId);

    return this.favoriteService.favorite(user, share, FavoriteType.SHARES);
  }

  @Span('Unfavorite Share')
  async unfavoriteShare(user: IUser, shareId: string): Promise<void> {
    this.logger.debug(
      `{${SharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
        shareId,
      })}`,
    );

    const share = await this.getShareById(shareId);

    return this.favoriteService.unfavorite(user, share, FavoriteType.SHARES);
  }

  @Span('Upload Additional Image')
  async uploadAdditionalImage(user: IUser, images: Array<Express.Multer.File>): Promise<string[]> {
    this.logger.debug(
      `{${SharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
      })}`,
    );

    return this.additionalImageService.uploadAdditionalImage(
      user._id,
      images,
      SHARES_FILE_POLICY.type,
    );
  }

  @Span('Delete Additional Image Url')
  async deleteAdditionalImageUrl(shareId: string, fileName: string): Promise<ShareDocument> {
    this.logger.debug(
      `{${SharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        shareId,
        fileName,
      })}`,
    );

    const share = await this.getShareById(shareId);

    await this.additionalImageService.deleteAdditionalImageUrl(fileName, share.additionalImageUrl);

    return this.sharesRepository.findByIdAndUpdate(shareId, {
      $pull: { additionalImageUrl: fileName },
    });
  }

  @Span('Delete Share')
  async deleteShare(user: IUser, shareId: string): Promise<ShareDocument> {
    const ctx = `${SharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}}} (called)\
      \n[param] ${prettyObjectString({
        user,
        shareId,
      })}`,
    );

    const share = await this.getShareById(shareId);
    const districtId = share.district._id.toString();

    this.checkDistrictPermission(user, districtId);

    const imageUrl = await this.minioClientService.moveFile(
      share.imageUrl,
      `${MINIO_FOLDER.bin}/${MINIO_FOLDER.shares}`,
    );

    if (!imageUrl) {
      throw new ErrorException(CODES.TEC_054);
    }

    const additionalImageUrl = share.additionalImageUrl?.length
      ? await this.minioClientService.moveFiles(
          share.additionalImageUrl,
          MINIO_FOLDER.shares,
          `${MINIO_FOLDER.bin}/${MINIO_FOLDER.shares}`,
        )
      : undefined;

    const deleteShare = {
      ...share,
      deletedBy: user._id,
      rejectedAutoDelete: undefined,
      submissionStatus: SubmissionStatus.REMOVED,
      imageUrl,
      additionalImageUrl,
    };

    this.logger.verbose(
      `{${ctx}} (create deleted share when delete share) data:\n${prettyObjectString({
        deleteShare,
      })}`,
    );

    await this.deletedSharesRepository.create(deleteShare);
    await this.favoriteService.deleteFavoriteByTargetId([share._id], FavoriteType.SHARES);

    return this.sharesRepository.findByIdAndDelete(shareId);
  }

  @Span('Delete Many Shares')
  async deleteMany(filterQuery: FilterQuery<ShareDocument>): Promise<Boolean> {
    this.logger.debug(
      `{${SharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
      })}`,
    );

    const shares = await this.sharesRepository.find(filterQuery, {
      id: 1,
      imageUrl: 1,
      additionalImageUrl: 1,
    });

    const sharesId = [];
    const shareImages = [];

    if (!shares.length) {
      return false;
    }

    shares.forEach(share => {
      sharesId.push(share._id);

      if (share.imageUrl) {
        shareImages.push(share.imageUrl);
      }

      if (share.additionalImageUrl?.length) {
        shareImages.push(...share.additionalImageUrl);
      }
    });

    await this.favoriteService.deleteFavoriteByTargetId(sharesId, FavoriteType.SHARES);

    if (shareImages.length) {
      await this.minioClientService.deleteManyFiles(shareImages);
    }

    return this.sharesRepository.deleteMany(filterQuery);
  }

  @Span('Make Request')
  async makeRequest(user: IUser, shareId: string): Promise<void> {
    this.logger.debug(
      `{${SharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
        shareId,
      })}`,
    );

    const makeQuery = {
      $addToSet: {
        requests: {
          user: user._id,
          status: SubmissionStatus.PENDING,
        },
      },
    };

    return this.requestHandler(shareId, makeQuery);
  }

  @Span('Cancel Request')
  async cancelRequest(user: IUser, shareId: string): Promise<void> {
    this.logger.debug(
      `{${SharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
        shareId,
      })}`,
    );

    const cancleQuery = {
      $pull: {
        requests: {
          user: user._id,
        },
      },
    };

    return this.requestHandler(shareId, cancleQuery);
  }

  @Span('Request Handler')
  private async requestHandler(
    shareId: string,
    updateQuery: UpdateQuery<ShareDocument>,
  ): Promise<void> {
    this.logger.debug(
      `{${SharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        shareId,
        updateQuery,
      })}`,
    );

    await this.sharesRepository.findByIdAndUpdate(shareId, updateQuery, {
      upsert: false,
      new: false,
    });
  }

  @Span('Check If District Id Valid')
  private async checkIfDistrictIdValid(districtId: string) {
    this.logger.debug(
      `{${SharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        districtId,
      })}`,
    );

    const validDistricts = await this.mapService.isDistrictsIdValid([districtId]);

    if (!validDistricts.isValid) {
      throw new ErrorException(CODES.TEC_017);
    }
  }

  @Span('Check District Permission')
  private checkDistrictPermission(user: IUser, districtId: string): void {
    const ctx = `${SharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        role: user.roles.TEC,
        districtId,
      })}`,
    );

    const hasPermission = checkDistrictPermission(user, districtId);

    this.logger.verbose(
      `{${ctx}} (has permission) data:\n${prettyObjectString({
        hasPermission,
      })}`,
    );

    if (!hasPermission) {
      throw new ErrorException(CODES.TEC_008);
    }
  }

  @Span('Check If Share Option Valid')
  private async checkIfShareOptionValid(
    typesId?: string[],
    conditionId?: string,
    shippingId?: string,
  ): Promise<void> {
    const ctx = `${SharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        typesId,
        conditionId,
        shippingId,
      })}`,
    );

    if (!typesId?.length && !conditionId && !shippingId) {
      return;
    }

    const results = await Promise.allSettled([
      typesId ? this.shareTypesService.checkIfShareTypesValid(typesId) : undefined,
      conditionId ? this.conditionOptionsService.getConditionOptionById(conditionId) : undefined,
      shippingId ? this.shippingOptionsService.getShippingOptionById(shippingId) : undefined,
    ]);

    this.logger.verbose(
      `{${ctx}} (get all share options) data:\n${prettyObjectString({
        results,
      })}`,
    );

    const errors: ErrorException[] = results.flatMap(result =>
      result.status === 'rejected' ? [result.reason.getResponse()] : [],
    );

    if (errors.length) {
      const errorMessages = [CODES.TEC_040.message];
      const errorDisplay = [];

      errors.forEach((error: ErrorException) => {
        errorDisplay.push(error.display);
        errorMessages.push(error.message);
      });

      throw new ErrorException(CODES.TEC_040, errorDisplay?.join(', '), errorMessages);
    }
  }
}
