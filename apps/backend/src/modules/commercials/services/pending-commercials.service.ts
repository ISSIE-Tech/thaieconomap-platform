import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { CommercialCategory, SubmissionStatus } from '@thaieconomap/contracts';
import { Express } from 'express';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../../common/exceptions';
import { AdditionalImageService } from '../../../modules/additional-image';
import { MapService } from '../../../modules/map/map.service';
import { MinioClientService } from '../../../modules/minio-client/minio-client.service';
import {
  CODES,
  COMMERCIAL_FILE_POLICY,
  MINIO_FOLDER,
  ONE_MONTH_IN_MS,
} from '../../../shared/constants';
import { IPaginationQuery, IPaginationResponse, IUser } from '../../../shared/interfaces';
import {
  checkDistrictPermission,
  getSpanName,
  isCustomerUser,
  isManagerUser,
  prettyObjectString,
  transformLatitudeAndLongitudeToGeoJson,
  transformOpeningToDisplayOpening,
} from '../../../shared/utils';
import {
  CreatePendingCommercialDto,
  GetPendingCommercialsQueryDto,
  UpdatePendingCommercialDto,
  UpdateRejectedPendingCommercialDto,
} from '../dto';
import { CommercialsRepository, PendingCommercialsRepository } from '../repositories';
import {
  BusinessType,
  CommercialDocument,
  PendingCommercialDocument,
  RestaurantType,
} from '../schemas';

import { BusinessTypesService } from './business-types.service';
import { RestaurantTypesService } from './restaurant-types.service';

@Injectable()
export class PendingCommercialsService {
  constructor(
    private readonly commercialsRepository: CommercialsRepository,
    private readonly pendingCommercialsRepository: PendingCommercialsRepository,
    private readonly minioClientService: MinioClientService,
    private readonly mapService: MapService,
    private readonly additionalImageService: AdditionalImageService,
    @Inject(forwardRef(() => RestaurantTypesService))
    private readonly restaurantTypesService: RestaurantTypesService,

    @Inject(forwardRef(() => BusinessTypesService))
    private readonly businessTypesService: BusinessTypesService,
  ) {}

  private basePopulation = ['district', 'createdBy', 'types'];
  private readonly logger: Logger = new Logger(PendingCommercialsService.name);

  @Span('Get One Pending Commercial')
  async getOne(
    filterQuery: FilterQuery<PendingCommercialDocument>,
    projection?: ProjectionType<PendingCommercialDocument>,
    options?: QueryOptions<PendingCommercialDocument>,
  ): Promise<PendingCommercialDocument> {
    this.logger.debug(
      `{${PendingCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
        projection,
        options,
      })}`,
    );

    return this.pendingCommercialsRepository.findOne(filterQuery, projection, options);
  }

  @Span('Get All Pending Commercials')
  async getAllPendingCommercials(user: IUser): Promise<PendingCommercialDocument[]> {
    this.logger.debug(
      `{${PendingCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        roles: user.roles.TEC,
      })}`,
    );

    const filter = isManagerUser(user) ? { district: user.districts } : {};

    return this.pendingCommercialsRepository.find(filter, {}, { populate: this.basePopulation });
  }

  @Span('Get Pending Commercials')
  async getPendingCommercials(
    user: IUser,
    getPendingCommercialsQueryDto: GetPendingCommercialsQueryDto,
  ): Promise<IPaginationResponse<PendingCommercialDocument>> {
    const ctx = `${PendingCommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        getPendingCommercialsQueryDto,
      })}`,
    );

    const query: IPaginationQuery<PendingCommercialDocument> = getPendingCommercialsQueryDto;

    if (isManagerUser(user)) {
      query.district = user.districts;
    }

    if (query?.types) {
      query.types = { $in: query.types };
    }

    query.submissionStatus = SubmissionStatus.PENDING;

    this.logger.verbose(
      `{${ctx}} (find announcements by query) query:\n${prettyObjectString({
        query,
      })}`,
    );

    return this.pendingCommercialsRepository.findWithPagination(
      query,
      ['name'],
      {},
      this.basePopulation,
    );
  }

  @Span('Get Pending Commercial By Id')
  async getPendingCommercialById(pendingCommercialId: string): Promise<PendingCommercialDocument> {
    this.logger.debug(
      `{${PendingCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        pendingCommercialId,
      })}`,
    );

    const pendingCommercial = await this.pendingCommercialsRepository.findById(pendingCommercialId);

    if (!pendingCommercial) {
      throw new ErrorException(CODES.TEC_010);
    }

    return pendingCommercial;
  }

  @Span('Get Private Pending Commercial By Id')
  async getPrivatePendingCommercialById(
    user: IUser,
    pendingCommercialId: string,
  ): Promise<PendingCommercialDocument> {
    this.logger.debug(
      `{${PendingCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        role: user.roles.TEC,
        pendingCommercialId,
      })}`,
    );

    const pendingCommercial = await this.getPendingCommercialById(pendingCommercialId);
    const districtId = pendingCommercial.district._id.toString();
    const isOwner = pendingCommercial.createdBy._id.toString() === user._id.toString();

    // bypass when isOwner and ADMIN //
    if (!isOwner && isCustomerUser(user)) {
      throw new ErrorException(CODES.TEC_033);
    }

    if (!isOwner && isManagerUser(user)) {
      this.checkDistrictPermission(user, districtId);
    }
    ////

    return pendingCommercial;
  }

  @Span('Get Permissioned Pending Commercial By Id')
  async getPermissionedPendingCommercialById(
    user: IUser,
    pendingCommercialId: string,
  ): Promise<PendingCommercialDocument> {
    this.logger.debug(
      `{${PendingCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        role: user.roles.TEC,
        pendingCommercialId,
      })}`,
    );

    const pendingCommercial = await this.getPendingCommercialById(pendingCommercialId);
    const districtId = pendingCommercial.district._id.toString();

    this.checkDistrictPermission(user, districtId);

    return pendingCommercial;
  }

  @Span('Create Pending Commercial')
  async createPendingCommercial(
    user: IUser,
    createPendingCommercialDto: CreatePendingCommercialDto,
    image: Express.Multer.File,
  ): Promise<PendingCommercialDocument> {
    const ctx = `${PendingCommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        createPendingCommercialDto,
      })}`,
    );

    await this.checkIfDistrictsIdValid(createPendingCommercialDto.district);

    await this.checkTypeIsMatchWithCommercialType(
      createPendingCommercialDto.category,
      createPendingCommercialDto.types,
    );

    if (createPendingCommercialDto.additionalImageUrl) {
      this.additionalImageService.checkAdditionalImagePermission(
        user._id,
        createPendingCommercialDto.additionalImageUrl,
        [],
      );

      createPendingCommercialDto.additionalImageUrl =
        await this.additionalImageService.moveAdditionalImage(
          user._id,
          createPendingCommercialDto.additionalImageUrl,
          MINIO_FOLDER.commercials,
        );
    }

    const uploadedImage = await this.minioClientService.upload(MINIO_FOLDER.commercials, image);
    const displayOpening = transformOpeningToDisplayOpening(createPendingCommercialDto.opening);
    const location = transformLatitudeAndLongitudeToGeoJson(createPendingCommercialDto.location);
    const createPendingCommercialData = {
      ...createPendingCommercialDto,
      location,
      displayOpening,
      imageUrl: uploadedImage,
      createdBy: user._id,
      typeRefPath:
        createPendingCommercialDto.category === CommercialCategory.BUSINESS
          ? BusinessType.name
          : RestaurantType.name,
    };

    this.logger.verbose(
      `{${ctx}} (create pending commercial data) data:\n${prettyObjectString({
        createPendingCommercialData,
      })}`,
    );

    return this.pendingCommercialsRepository.create(createPendingCommercialData);
  }

  @Span('Update Pending Commercial')
  async updatePendingCommercial(
    user: IUser,
    pendingCommercialId: string,
    updatePendingCommercialDto: UpdatePendingCommercialDto,
    image: Express.Multer.File,
  ): Promise<PendingCommercialDocument> {
    const ctx = `${PendingCommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        pendingCommercialId,
        updatePendingCommercialDto,
      })}`,
    );

    const pendingCommercial = await this.getPrivatePendingCommercialById(user, pendingCommercialId);

    if (updatePendingCommercialDto.district) {
      await this.checkIfDistrictsIdValid(updatePendingCommercialDto.district);
    }

    const { category, types, ...updateQuery } = updatePendingCommercialDto;
    const selectedCategory = category ? category : pendingCommercial.category;
    const selectedTypes = types?.length ? types : pendingCommercial.types;

    await this.checkTypeIsMatchWithCommercialType(selectedCategory, selectedTypes as string[]);

    if (updatePendingCommercialDto.additionalImageUrl) {
      updateQuery.additionalImageUrl =
        await this.additionalImageService.getUpdateAdditionalImageUrlQuery(
          user,
          updatePendingCommercialDto.additionalImageUrl,
          pendingCommercial.additionalImageUrl,
          MINIO_FOLDER.commercials,
        );
    }

    const updatedPendingCommercial = {
      ...updateQuery,
      imageUrl: image
        ? await this.minioClientService.replaceFile(
            MINIO_FOLDER.commercials,
            image,
            pendingCommercial.imageUrl,
          )
        : pendingCommercial.imageUrl,
      location: updatePendingCommercialDto.location
        ? transformLatitudeAndLongitudeToGeoJson(updatePendingCommercialDto.location)
        : pendingCommercial.location,
      displayOpening: updatePendingCommercialDto.opening
        ? transformOpeningToDisplayOpening(updatePendingCommercialDto.opening)
        : pendingCommercial.displayOpening,
      types,
      category,
      typeRefPath:
        category === CommercialCategory.BUSINESS ? BusinessType.name : RestaurantType.name,
    };

    this.logger.verbose(
      `{${ctx}} (update pending commercial data) data:\n${prettyObjectString({
        updatedPendingCommercial,
      })}`,
    );

    return this.pendingCommercialsRepository.findByIdAndUpdate(
      pendingCommercialId,
      updatedPendingCommercial,
    );
  }

  @Span('Update Rejected Pending Commercial')
  async updateRejectedPendingCommercial(
    user: IUser,
    pendingCommercialId: string,
    updateRejectedPendingCommercialDto: UpdateRejectedPendingCommercialDto,
    image: Express.Multer.File,
  ): Promise<PendingCommercialDocument> {
    const pendingCommercial = await this.getPrivatePendingCommercialById(user, pendingCommercialId);
    const isRejected = pendingCommercial.submissionStatus === SubmissionStatus.REJECTED;

    if (!isRejected) {
      throw new ErrorException(CODES.TEC_033);
    }

    await this.restoreRejectedPendingCommercial(user, pendingCommercialId);

    return this.updatePendingCommercial(
      user,
      pendingCommercialId,
      updateRejectedPendingCommercialDto,
      image,
    );
  }

  @Span('Approve Pending Commercial')
  async approvePendingCommercial(
    user: IUser,
    pendingCommercialId: string,
  ): Promise<CommercialDocument> {
    const ctx = `${PendingCommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pendingCommercialId,
      })}`,
    );

    const pendingCommercial = await this.getPermissionedPendingCommercialById(
      user,
      pendingCommercialId,
    );

    const isRejected = pendingCommercial.submissionStatus === SubmissionStatus.REJECTED;

    if (isRejected) {
      throw new ErrorException(CODES.TEC_032);
    }

    const commercial = {
      ...pendingCommercial,
      approvedBy: user._id,
      lastModifiedBy: user._id,
      submissionStatus: SubmissionStatus.ACCEPTED,
      rejectedAutoDelete: undefined,
      rejectedCompletelyDeleteAt: undefined,
    };

    this.logger.verbose(
      `{${ctx}} (create commercial when approve pending commercial) data:\n${prettyObjectString({
        commercial,
      })}`,
    );

    const createdCommercial = await this.commercialsRepository.create(commercial);

    this.logger.verbose(
      `{${ctx}} (delete pending commercial when approve commercial) data:\n${prettyObjectString({
        pendingCommercialId,
      })}`,
    );

    await this.pendingCommercialsRepository.findByIdAndDelete(pendingCommercialId);

    return createdCommercial;
  }

  @Span('Reject Pending Commercial')
  async rejectPendingCommercial(
    user: IUser,
    pendingCommercialId: string,
    submissionMessage: string,
  ): Promise<void> {
    const ctx = `${PendingCommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        name: user.name,
        pendingCommercialId,
        submissionMessage,
      })}`,
    );

    const pendingCommercial = await this.getPermissionedPendingCommercialById(
      user,
      pendingCommercialId,
    );

    const isRejected = pendingCommercial.submissionStatus === SubmissionStatus.REJECTED;

    if (isRejected) {
      throw new ErrorException(CODES.TEC_031);
    }

    const imageUrl = await this.minioClientService.moveFile(
      pendingCommercial.imageUrl,
      `${MINIO_FOLDER.bin}/${MINIO_FOLDER.commercials}`,
    );

    if (!imageUrl) {
      throw new ErrorException(CODES.TEC_054);
    }

    const additionalImageUrl = pendingCommercial.additionalImageUrl
      ? await this.minioClientService.moveFiles(
          pendingCommercial.additionalImageUrl,
          MINIO_FOLDER.commercials,
          `${MINIO_FOLDER.bin}/${MINIO_FOLDER.commercials}`,
        )
      : undefined;

    const rejectPendingCommercial = {
      submissionStatus: SubmissionStatus.REJECTED,
      submissionMessage,
      rejectedAutoDelete: new Date(),
      rejectedCompletelyDeleteAt: Date.now() + ONE_MONTH_IN_MS,
      imageUrl,
      additionalImageUrl,
    };

    this.logger.verbose(
      `{${ctx}} (update pending commercial when reject) data:\n${prettyObjectString({
        rejectPendingCommercial,
      })}`,
    );

    await this.pendingCommercialsRepository.findByIdAndUpdate(
      pendingCommercialId,
      rejectPendingCommercial,
    );
  }

  @Span('Restore Rejected Pending Commercial')
  async restoreRejectedPendingCommercial(user: IUser, pendingCommercialId: string) {
    const ctx = `${PendingCommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pendingCommercialId,
      })}`,
    );

    const pendingCommercial = await this.getPrivatePendingCommercialById(user, pendingCommercialId);
    const isRejected = pendingCommercial.submissionStatus === SubmissionStatus.REJECTED;

    if (!isRejected) {
      throw new ErrorException(CODES.TEC_058);
    }

    const imageUrl = await this.minioClientService.moveFile(
      pendingCommercial.imageUrl,
      MINIO_FOLDER.commercials,
    );

    if (!imageUrl) {
      throw new ErrorException(CODES.TEC_054);
    }

    const additionalImageUrl = pendingCommercial.additionalImageUrl
      ? await this.minioClientService.moveFiles(
          pendingCommercial.additionalImageUrl,
          `${MINIO_FOLDER.bin}/${MINIO_FOLDER.commercials}`,
          MINIO_FOLDER.commercials,
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
      `{${ctx}} (update pending commercial when restore) data:\n${prettyObjectString({
        updatePendingCommercial,
      })}`,
    );

    return this.pendingCommercialsRepository.findByIdAndUpdate(
      pendingCommercialId,
      updatePendingCommercial,
    );
  }

  @Span('Delete Additional Image Url')
  async deleteAdditionalImageUrl(
    user: IUser,
    pendingCommercialId: string,
    fileName: string,
  ): Promise<PendingCommercialDocument> {
    this.logger.debug(
      `{${PendingCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
        pendingCommercialId,
        fileName,
      })}`,
    );

    const pendingCommercial = await this.getPrivatePendingCommercialById(user, pendingCommercialId);

    await this.additionalImageService.deleteAdditionalImageUrl(
      fileName,
      pendingCommercial.additionalImageUrl,
    );

    return this.pendingCommercialsRepository.findByIdAndUpdate(pendingCommercialId, {
      $pull: { additionalImageUrl: fileName },
    });
  }

  @Span('Upload Additional Image')
  async uploadAdditionalImage(user: IUser, images: Array<Express.Multer.File>): Promise<string[]> {
    this.logger.debug(
      `{${PendingCommercialsService.name}-[${getSpanName()}]} (called)\
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

  @Span('Delete Pending Commercial')
  async deletePendingCommercial(user: IUser, pendingCommercialId: string): Promise<boolean> {
    this.logger.debug(
      `{${PendingCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        pendingCommercialId,
      })}`,
    );

    // throws unless owner, admin, or manager of the district
    await this.getPrivatePendingCommercialById(user, pendingCommercialId);

    return this.deleteMany({ _id: pendingCommercialId });
  }

  @Span('Delete Many')
  async deleteMany(filterQuery: FilterQuery<PendingCommercialDocument>): Promise<boolean> {
    this.logger.debug(
      `{${PendingCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
      })}`,
    );

    const pendingCommercials = await this.pendingCommercialsRepository.find(filterQuery, {
      imageUrl: 1,
      additionalImageUrl: 1,
    });

    if (!pendingCommercials.length) {
      return false;
    }

    const pendingCommercialImages = [];

    pendingCommercials.forEach(pendingCommercial => {
      if (pendingCommercial.imageUrl) {
        pendingCommercialImages.push(pendingCommercial.imageUrl);
      }

      if (pendingCommercial.additionalImageUrl?.length) {
        pendingCommercialImages.push(...pendingCommercial.additionalImageUrl);
      }
    });

    if (pendingCommercialImages.length) {
      await this.minioClientService.deleteManyFiles(pendingCommercialImages);
    }

    return this.pendingCommercialsRepository.deleteMany(filterQuery);
  }

  @Span('Check If Districts Id Valid')
  private async checkIfDistrictsIdValid(districtsId: string): Promise<void> {
    this.logger.debug(
      `{${PendingCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        districtsId,
      })}`,
    );

    const validDistricts = await this.mapService.isDistrictsIdValid([districtsId]);

    if (!validDistricts.isValid) {
      throw new ErrorException(CODES.TEC_017);
    }
  }

  @Span('Check District Permission')
  private checkDistrictPermission(user: IUser, districtId: string): void {
    const ctx = `${PendingCommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        name: user.name,
        role: user.roles.TEC,
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
      `{${PendingCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        commercial,
        types,
      })}`,
    );

    if (commercial === CommercialCategory.RESTAURANT) {
      const existType = await this.restaurantTypesService.getRestaurantTypeByIds(types);

      if (existType.length !== types.length) {
        throw new ErrorException(CODES.TEC_051);
      }
    }

    if (commercial === CommercialCategory.BUSINESS) {
      const existType = await this.businessTypesService.getBusinessTypeByIds(types);

      if (existType.length !== types.length) {
        throw new ErrorException(CODES.TEC_051);
      }
    }
  }
}
