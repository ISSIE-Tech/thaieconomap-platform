import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import {
  CommercialCategory,
  CommercialWorkingHour,
  FavoriteType,
  SearchLocation,
  SubmissionStatus,
} from '@thaieconomap/contracts';
import { Express } from 'express';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../../common/exceptions';
import { CONFIG } from '../../../config';
import { AdditionalImageService } from '../../../modules/additional-image';
import { MapService } from '../../../modules/map/map.service';
import { MinioClientService } from '../../../modules/minio-client/minio-client.service';
import { FavoriteDocument } from '../../../modules/users/schemas';
import { FavoriteService } from '../../../modules/users/services';
import { CODES, COMMERCIAL_FILE_POLICY, MINIO_FOLDER } from '../../../shared/constants';
import { IPaginationQuery, IPaginationResponse, IUser } from '../../../shared/interfaces';
import {
  checkDistrictPermission,
  createGeoNearQuery,
  getSpanName,
  isManagerUser,
  prettyObjectString,
  transformLatitudeAndLongitudeToGeoJson,
  transformOpeningToDisplayOpening,
} from '../../../shared/utils';
import {
  CreateCommercialDto,
  GetCommercialsQueryDto,
  GetCommercialsTinyQueryDto,
  UpdateCommercialDto,
} from '../dto';
import { CommercialsRepository, DeletedCommercialsRepository } from '../repositories';
import { BusinessType, CommercialDocument, RestaurantType } from '../schemas';

import { BusinessTypesService } from './business-types.service';
import { RestaurantTypesService } from './restaurant-types.service';

@Injectable()
export class CommercialsService {
  constructor(
    private readonly commercialsRepository: CommercialsRepository,
    private readonly deletedcommercialsRepository: DeletedCommercialsRepository,
    private readonly minioClientService: MinioClientService,
    private readonly mapService: MapService,
    private readonly favoriteService: FavoriteService,
    private readonly additionalImageService: AdditionalImageService,

    @Inject(forwardRef(() => RestaurantTypesService))
    private readonly restaurantTypesService: RestaurantTypesService,

    @Inject(forwardRef(() => BusinessTypesService))
    private readonly businessTypesService: BusinessTypesService,
  ) {}

  private readonly logger: Logger = new Logger(CommercialsService.name);
  private basePopolation = [
    { path: 'district' },
    { path: 'createdBy', select: '_id authId' },
    { path: 'lastModifiedBy', select: '_id authId' },
    { path: 'approvedBy', select: '_id authId' },
    { path: 'types' },
  ];

  @Span('Get One Commercial')
  async getOne(
    filterQuery: FilterQuery<CommercialDocument>,
    projection?: ProjectionType<CommercialDocument>,
    options?: QueryOptions<CommercialDocument>,
  ): Promise<CommercialDocument> {
    this.logger.debug(
      `{${CommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
        projection,
        options,
      })}`,
    );

    return this.commercialsRepository.findOne(filterQuery, projection, options);
  }

  @Span('Get All Commercials')
  async getAllCommercials(user: IUser): Promise<CommercialDocument[]> {
    this.logger.debug(
      `{${CommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        roles: user.roles.TEC,
      })}`,
    );

    const filter = isManagerUser(user) ? { district: user.districts } : {};

    return this.commercialsRepository.find(filter, {}, { populate: this.basePopolation });
  }

  @Span('Get Shops And Commercials')
  async getShopsAndCommercials(
    getCommercialsTinyQueryDto: GetCommercialsTinyQueryDto,
  ): Promise<CommercialDocument[]> {
    const ctx = `${CommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        getCommercialsTinyQueryDto,
      })}`,
    );

    const query: FilterQuery<CommercialDocument> = {};

    if (getCommercialsTinyQueryDto.category) {
      query.category = getCommercialsTinyQueryDto.category;
    }

    if (getCommercialsTinyQueryDto.location === SearchLocation.NEAR_ME) {
      query.location = createGeoNearQuery(
        getCommercialsTinyQueryDto.latitude,
        getCommercialsTinyQueryDto.longitude,
        CONFIG.MAX_DISTANCE_METERS,
        0,
      );
    }

    if (getCommercialsTinyQueryDto.workingHour !== CommercialWorkingHour.ANYTIME) {
      query.workingStatus = getCommercialsTinyQueryDto.workingHour;
    }

    if (getCommercialsTinyQueryDto?.types) {
      query.types = { $in: getCommercialsTinyQueryDto.types };
    }

    this.logger.verbose(
      `{${ctx}} (find shops and commercials) query:\n${prettyObjectString({
        query,
      })}`,
    );

    return this.commercialsRepository.findShopsAndCommercials(query, {
      name: 1,
      category: 1,
      location: 1,
    });
  }

  @Span('Get Commercials')
  async getCommercials(
    user: IUser,
    getCommercialsQueryDto: GetCommercialsQueryDto,
  ): Promise<IPaginationResponse<CommercialDocument>> {
    this.logger.debug(
      `{${CommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
        getCommercialsQueryDto,
      })}`,
    );

    const query: IPaginationQuery<CommercialDocument> = getCommercialsQueryDto;

    if (isManagerUser(user)) {
      query.district = user.districts;
    }

    if (query?.types) {
      query.types = { $in: query.types };
    }

    return this.commercialsRepository.findWithPagination(query, ['name'], {}, this.basePopolation);
  }

  @Span('Get Shops And Commercials By Id')
  async getShopsAndCommercialsById(user: IUser, commercialId: string): Promise<CommercialDocument> {
    this.logger.debug(
      `{${CommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        commercialId,
      })}`,
    );

    const commercial = await this.commercialsRepository.findShopsAndCommercialsById(commercialId, {
      opening: 0,
      createdBy: 0,
      submissionStatus: 0,
      approvedBy: 0,
      lastModifiedBy: 0,
      createdAt: 0,
      approvedAt: 0,
      lastModifiedAt: 0,
    });

    if (!commercial) {
      throw new ErrorException(CODES.TEC_006);
    }

    commercial.isFavorite = false;

    if (user) {
      commercial.isFavorite = await this.favoriteService.isFavoriteTheTarget(user, commercial);
    }

    return commercial;
  }

  @Span('Create Commercial')
  async createCommercial(
    user: IUser,
    createCommercialDto: CreateCommercialDto,
    image: Express.Multer.File,
  ): Promise<CommercialDocument> {
    const ctx = `${CommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        createCommercialDto,
      })}`,
    );

    this.checkDistrictPermission(user, createCommercialDto.district);

    await this.checkTypeIsMatchWithCommercialType(
      createCommercialDto.category,
      createCommercialDto.types,
    );

    await this.checkIfDistrictsIdValid(createCommercialDto.district);

    if (createCommercialDto.additionalImageUrl) {
      this.additionalImageService.checkAdditionalImagePermission(
        user._id,
        createCommercialDto.additionalImageUrl,
        [],
      );

      createCommercialDto.additionalImageUrl =
        await this.additionalImageService.moveAdditionalImage(
          user._id,
          createCommercialDto.additionalImageUrl,
          MINIO_FOLDER.commercials,
        );
    }

    const uploadedImage = await this.minioClientService.upload(MINIO_FOLDER.commercials, image);
    const location = transformLatitudeAndLongitudeToGeoJson(createCommercialDto.location);
    const displayOpening = transformOpeningToDisplayOpening(createCommercialDto.opening);
    const commercial = {
      ...createCommercialDto,
      location,
      imageUrl: uploadedImage,
      createdBy: user._id,
      lastModifiedBy: user._id,
      approvedBy: user._id,
      submissionStatus: SubmissionStatus.ACCEPTED,
      displayOpening,
      typeRefPath:
        createCommercialDto.category === CommercialCategory.BUSINESS
          ? BusinessType.name
          : RestaurantType.name,
    };

    this.logger.verbose(
      `{${ctx}} (create commercial) data:\n${prettyObjectString({
        commercial,
      })}`,
    );

    return this.commercialsRepository.create(commercial);
  }

  @Span('Update Commercial')
  async updateCommercial(
    user: IUser,
    commercialId: string,
    updateCommercialDto: UpdateCommercialDto,
    image: Express.Multer.File,
  ): Promise<CommercialDocument> {
    const ctx = `${CommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        commercialId,
        updateCommercialDto,
      })}`,
    );

    const commercial = await this.getCommercialById(user, commercialId);

    if (updateCommercialDto.district) {
      await this.checkIfDistrictsIdValid(updateCommercialDto.district);
    }

    const types = updateCommercialDto?.types?.length ? updateCommercialDto.types : commercial.types;
    const category = updateCommercialDto?.category
      ? updateCommercialDto.category
      : commercial.category;

    await this.checkTypeIsMatchWithCommercialType(category, types as string[]);

    if (updateCommercialDto.additionalImageUrl) {
      updateCommercialDto.additionalImageUrl =
        await this.additionalImageService.getUpdateAdditionalImageUrlQuery(
          user,
          updateCommercialDto.additionalImageUrl,
          commercial.additionalImageUrl,
          MINIO_FOLDER.commercials,
        );
    }

    const updatedCommercial = {
      ...updateCommercialDto,
      location: updateCommercialDto.location
        ? transformLatitudeAndLongitudeToGeoJson(updateCommercialDto.location)
        : commercial.location,
      imageUrl: image
        ? await this.minioClientService.replaceFile(
            MINIO_FOLDER.commercials,
            image,
            commercial.imageUrl,
          )
        : commercial.imageUrl,
      displayOpening: updateCommercialDto.opening
        ? transformOpeningToDisplayOpening(updateCommercialDto.opening)
        : commercial.displayOpening,
      lastModifiedBy: user._id,
      lastModifiedAt: Date.now(),
      types,
      category,
      typeRefPath:
        category === CommercialCategory.BUSINESS ? BusinessType.name : RestaurantType.name,
    };

    this.logger.verbose(
      `{${ctx}} (update commercial) data:\n${prettyObjectString({
        updatedCommercial,
      })}`,
    );

    return this.commercialsRepository.findByIdAndUpdate(commercialId, updatedCommercial);
  }

  @Span('Delete Commercial')
  async deleteCommercial(user: IUser, commercialId: string): Promise<CommercialDocument> {
    const ctx = `${CommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}}} (called)\
      \n[param] ${prettyObjectString({
        user,
        commercialId,
      })}`,
    );

    const commercial = await this.getCommercialById(user, commercialId);
    const imageUrl = await this.minioClientService.moveFile(
      commercial.imageUrl,
      `${MINIO_FOLDER.bin}/${MINIO_FOLDER.commercials}`,
    );

    if (!imageUrl) {
      throw new ErrorException(CODES.TEC_054);
    }

    const additionalImageUrl = commercial.additionalImageUrl?.length
      ? await this.minioClientService.moveFiles(
          commercial.additionalImageUrl,
          MINIO_FOLDER.commercials,
          `${MINIO_FOLDER.bin}/${MINIO_FOLDER.commercials}`,
        )
      : undefined;

    const deleteCommercial = {
      ...commercial,
      deletedBy: user._id,
      submissionStatus: SubmissionStatus.REMOVED,
      imageUrl,
      additionalImageUrl,
    };

    this.logger.verbose(
      `{${ctx}} (create deleted commercial when delete commercial) data:\n${prettyObjectString({
        deleteCommercial,
      })}`,
    );

    await this.deletedcommercialsRepository.create(deleteCommercial);

    const isStore = commercial.category === CommercialCategory.BUSINESS;
    const type = isStore ? FavoriteType.BUSINESSES : FavoriteType.RESTAURANTS;

    await this.favoriteService.deleteFavoriteByTargetId([commercial._id], type);

    return this.commercialsRepository.findByIdAndDelete(commercialId);
  }

  @Span('Get Commercial By Id')
  async getCommercialById(user: IUser, commercialId: string): Promise<CommercialDocument> {
    this.logger.debug(
      `{${CommercialsService.name}-[${getSpanName()}] (called)\
      \n[param] ${prettyObjectString({
        user,
        commercialId,
      })}`,
    );

    const commercial = await this.commercialsRepository.findById(commercialId);

    if (!commercial) {
      throw new ErrorException(CODES.TEC_006);
    }

    return commercial;
  }

  @Span('Favorite Commercial')
  async favoriteCommercial(user: IUser, commercialId: string): Promise<FavoriteDocument> {
    this.logger.debug(
      `{${CommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
        commercialId,
      })}`,
    );

    const commercial = await this.getShopsAndCommercialsById(undefined, commercialId);
    const isStore = commercial.category === CommercialCategory.BUSINESS;
    const type = isStore ? FavoriteType.BUSINESSES : FavoriteType.RESTAURANTS;

    return this.favoriteService.favorite(user, commercial, type);
  }

  @Span('Unfavorite Commercial')
  async unfavoriteCommercial(user: IUser, commercialId: string): Promise<void> {
    this.logger.debug(
      `{${CommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
        commercialId,
      })}`,
    );

    const commercial = await this.getShopsAndCommercialsById(undefined, commercialId);
    const isStore = commercial.category === CommercialCategory.BUSINESS;
    const type = isStore ? FavoriteType.BUSINESSES : FavoriteType.RESTAURANTS;

    return this.favoriteService.unfavorite(user, commercial, type);
  }

  @Span('Upload Additional Image')
  async uploadAdditionalImage(user: IUser, images: Array<Express.Multer.File>): Promise<string[]> {
    this.logger.debug(
      `{${CommercialsService.name}-[${getSpanName()}] (called)\
      \n[param] ${prettyObjectString({
        user,
      })}`,
    );

    return this.additionalImageService.uploadAdditionalImage(
      user._id,
      images,
      COMMERCIAL_FILE_POLICY.type,
    );
  }

  @Span('Delete Additional Image Url')
  async deleteAdditionalImageUrl(
    user: IUser,
    commercialId: string,
    fileName: string,
  ): Promise<CommercialDocument> {
    this.logger.debug(
      `{${CommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
        commercialId,
        fileName,
      })}`,
    );

    const commercial = await this.getCommercialById(user, commercialId);

    await this.additionalImageService.deleteAdditionalImageUrl(
      fileName,
      commercial.additionalImageUrl,
    );

    return this.commercialsRepository.findByIdAndUpdate(commercialId, {
      $pull: { additionalImageUrl: fileName },
    });
  }

  @Span('Delete Many Commercials')
  async deleteMany(filterQuery: FilterQuery<CommercialDocument>): Promise<boolean> {
    this.logger.debug(
      `{${CommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
      })}`,
    );

    const commercials = await this.commercialsRepository.find(filterQuery, { id: 1, imageUrl: 1 });
    const commercialIds = [];
    const commercialImages = [];

    if (!commercials.length) {
      return false;
    }

    const favoriteType =
      filterQuery?.category === CommercialCategory.RESTAURANT
        ? FavoriteType.RESTAURANTS
        : FavoriteType.BUSINESSES;

    commercials.forEach(commercial => {
      commercialIds.push(commercial._id);

      if (commercial.imageUrl) {
        commercialImages.push(commercial.imageUrl);
      }
    });

    if (favoriteType) {
      await this.favoriteService.deleteFavoriteByTargetId(commercialIds, favoriteType);
    }

    if (commercialImages.length) {
      await this.minioClientService.deleteManyFiles(commercialImages);
    }

    return this.commercialsRepository.deleteMany(filterQuery);
  }

  @Span('Check If Districts Id Valid')
  private async checkIfDistrictsIdValid(districtId: string): Promise<void> {
    this.logger.debug(
      `{${CommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        districtId,
      })}`,
    );

    const isDistrictsIdValid = await this.mapService.isDistrictsIdValid([districtId]);

    if (!isDistrictsIdValid.isValid) {
      throw new ErrorException(CODES.TEC_017);
    }
  }

  @Span('Check District Permission')
  private checkDistrictPermission(user: IUser, districtId: string): void {
    const ctx = `${CommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        districtId,
      })}`,
    );

    const hasAccessToDistrict = checkDistrictPermission(user, districtId);

    this.logger.verbose(
      `{${ctx}} (has access to district) data:\n${prettyObjectString({
        hasAccessToDistrict,
      })}`,
    );

    if (!hasAccessToDistrict) {
      throw new ErrorException(CODES.TEC_008);
    }
  }

  @Span('Check Type Is Match With Commercial Type')
  private async checkTypeIsMatchWithCommercialType(
    commercial: string,
    types: string[],
  ): Promise<void> {
    this.logger.debug(
      `{${CommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        commercial,
        types,
      })}`,
    );

    if (commercial === CommercialCategory.RESTAURANT) {
      const existTypes = await this.restaurantTypesService.getRestaurantTypeByIds(types);

      if (existTypes.length !== types.length) {
        throw new ErrorException(CODES.TEC_051);
      }
    }

    if (commercial === CommercialCategory.BUSINESS) {
      const existTypes = await this.businessTypesService.getBusinessTypeByIds(types);

      if (existTypes.length !== types.length) {
        throw new ErrorException(CODES.TEC_051);
      }
    }
  }
}
