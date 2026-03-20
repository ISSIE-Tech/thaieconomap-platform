import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { ShareStatus, SubmissionStatus } from '@thaieconomap/contracts';
import { Express } from 'express';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../../common/exceptions';
import { AdditionalImageService } from '../../../modules/additional-image';
import { MapService } from '../../../modules/map/map.service';
import { MinioClientService } from '../../../modules/minio-client/minio-client.service';
import { CODES, MINIO_FOLDER, SHARES_FILE_POLICY } from '../../../shared/constants';
import { IPaginationQuery, IPaginationResponse, IUser } from '../../../shared/interfaces';
import {
  checkDistrictPermission,
  getSpanName,
  isCustomerUser,
  isManagerUser,
  prettyObjectString,
  transformLatitudeAndLongitudeToGeoJson,
} from '../../../shared/utils';
import {
  CreatePendingShareDto,
  GetPendingSharesQueryDto,
  UpdatePendingShareDto,
  UpdateRejectedPendingShareDto,
} from '../dto';
import { PendingSharesRepository, SharesRepository } from '../repositories';
import { PendingShareDocument, ShareDocument } from '../schemas';

import { ConditionOptionsService } from './condition-options.service';
import { ShareTypesService } from './share-types.service';
import { ShippingOptionsService } from './shipping-options.service';

@Injectable()
export class PendingSharesService {
  private readonly logger: Logger = new Logger(PendingSharesService.name);

  constructor(
    private readonly pendingSharesRepository: PendingSharesRepository,
    private readonly sharesRepository: SharesRepository,
    private readonly minioClientService: MinioClientService,
    private readonly mapService: MapService,
    private readonly additionalImageService: AdditionalImageService,

    @Inject(forwardRef(() => ShareTypesService))
    private readonly shareTypesService: ShareTypesService,

    @Inject(forwardRef(() => ConditionOptionsService))
    private readonly conditionOptionsService: ConditionOptionsService,

    @Inject(forwardRef(() => ShippingOptionsService))
    private readonly shippingOptionsService: ShippingOptionsService,
  ) {}

  @Span('Get One Pending Share')
  async getOne(
    filterQuery: FilterQuery<PendingShareDocument>,
    projection?: ProjectionType<PendingShareDocument>,
    options?: QueryOptions<PendingShareDocument>,
  ): Promise<PendingShareDocument> {
    this.logger.debug(
      `{${PendingSharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
        projection,
        options,
      })}`,
    );

    return this.pendingSharesRepository.findOne(filterQuery, projection, options);
  }

  @Span('Get All Pending Shares')
  async getAllPendingShares(user: IUser): Promise<PendingShareDocument[]> {
    this.logger.debug(
      `{${PendingSharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        role: user.roles.TEC,
      })}`,
    );

    const filter = isManagerUser(user) ? { district: user.districts } : {};

    return this.pendingSharesRepository.find(filter, {});
  }

  @Span('Get Paginated Pending Shares')
  async getPaginatedPendingShares(
    user: IUser,
    getPendingSharesQueryDto: GetPendingSharesQueryDto,
  ): Promise<IPaginationResponse<PendingShareDocument>> {
    const ctx = `${PendingSharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        getPendingSharesQueryDto,
      })}`,
    );

    const query: IPaginationQuery<PendingShareDocument> = getPendingSharesQueryDto;
    const projection = {
      detail: 0,
      moreDetail: 0,
      rejectedAutoDelete: 0,
      rejectedCompletelyDeletedAt: 0,
      submissionMessage: 0,
      createdBy: 0,
    };

    if (query.types) {
      query.types = { $in: query.types };
    }

    if (isManagerUser(user)) {
      query.district = user.districts;
    }

    query.submissionStatus = SubmissionStatus.PENDING;

    this.logger.verbose(
      `{${ctx}} (find paginate pending shares) query:\n${prettyObjectString({
        query,
      })}`,
    );

    return this.pendingSharesRepository.findWithPagination(query, ['name'], projection);
  }

  @Span('Get Pending Share By Id')
  async getPendingShareById(pendingShareId: string): Promise<PendingShareDocument> {
    this.logger.debug(
      `{${PendingSharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        pendingShareId,
      })}`,
    );

    const pendingShare = await this.pendingSharesRepository.findById(pendingShareId);

    if (!pendingShare) {
      throw new ErrorException(CODES.TEC_025);
    }

    return pendingShare;
  }

  @Span('Get Private Pending Share By Id')
  async getPrivatePendingShareById(user: IUser, pendingShareId: string) {
    this.logger.debug(
      `{${PendingSharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        role: user.roles.TEC,
        pendingShareId,
      })}`,
    );

    const pendingShare = await this.getPendingShareById(pendingShareId);
    const districtId = pendingShare.district._id.toString();
    const isOwner = pendingShare.createdBy._id.toString() === user._id.toString();

    // bypass when isOwner and ADMIN //
    if (!isOwner && isCustomerUser(user)) {
      throw new ErrorException(CODES.TEC_036);
    }

    if (!isOwner && isManagerUser(user)) {
      this.checkDistrictPermission(user, districtId);
    }
    ////

    return pendingShare;
  }

  @Span('Get Permissioned Pending Share By Id')
  async getPermissionedPendingShareById(
    user: IUser,
    pendingShareId: string,
  ): Promise<PendingShareDocument> {
    this.logger.debug(
      `{${PendingSharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        role: user.roles.TEC,
        pendingShareId,
      })}`,
    );

    const pendingShare = await this.getPendingShareById(pendingShareId);
    const districtId = pendingShare.district._id.toString();

    this.checkDistrictPermission(user, districtId);

    return pendingShare;
  }

  @Span('Create Pending Share')
  async createPendingShare(
    user: IUser,
    createPendingShareDto: CreatePendingShareDto,
    image: Express.Multer.File,
  ): Promise<PendingShareDocument> {
    const ctx = `${PendingSharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        createPendingShareDto,
      })}`,
    );

    await this.checkIfDistrictIdValid(createPendingShareDto.district);

    await this.checkIfShareOptionValid(
      createPendingShareDto.types,
      createPendingShareDto.condition,
      createPendingShareDto.shipping,
    );

    if (createPendingShareDto.additionalImageUrl) {
      this.additionalImageService.checkAdditionalImagePermission(
        user._id,
        createPendingShareDto.additionalImageUrl,
        [],
      );

      createPendingShareDto.additionalImageUrl =
        await this.additionalImageService.moveAdditionalImage(
          user._id,
          createPendingShareDto.additionalImageUrl,
          MINIO_FOLDER.shares,
        );
    }

    const location = transformLatitudeAndLongitudeToGeoJson(createPendingShareDto.location);
    const imageUrl = await this.minioClientService.upload(
      MINIO_FOLDER.shares,
      image,
      SHARES_FILE_POLICY.type,
    );

    const pendingShare = {
      ...createPendingShareDto,
      location,
      imageUrl,
      createdBy: user._id,
    };

    this.logger.verbose(
      `{${ctx}} (create pending share) data:\n${prettyObjectString({
        pendingShare,
      })}`,
    );

    return this.pendingSharesRepository.create(pendingShare);
  }

  @Span('Update Pending Share')
  async updatePendingShare(
    user: IUser,
    pendingShareId: string,
    updatePendingShareDto: UpdatePendingShareDto,
    image: Express.Multer.File,
  ): Promise<PendingShareDocument> {
    const ctx = `${PendingSharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pendingShareId,
        updatePendingShareDto,
      })}`,
    );

    const pendingShare = await this.getPrivatePendingShareById(user, pendingShareId);

    if (updatePendingShareDto.district) {
      await this.checkIfDistrictIdValid(updatePendingShareDto.district);
    }

    await this.checkIfShareOptionValid(
      updatePendingShareDto.types,
      updatePendingShareDto.condition,
      updatePendingShareDto.shipping,
    );

    if (updatePendingShareDto.additionalImageUrl) {
      updatePendingShareDto.additionalImageUrl =
        await this.additionalImageService.getUpdateAdditionalImageUrlQuery(
          user,
          updatePendingShareDto.additionalImageUrl,
          pendingShare.additionalImageUrl,
          MINIO_FOLDER.shares,
        );
    }

    const updatedPendingShare = {
      ...updatePendingShareDto,
      imageUrl: image
        ? await this.minioClientService.replaceFile(
            MINIO_FOLDER.shares,
            image,
            pendingShare.imageUrl,
          )
        : pendingShare.imageUrl,
      location: updatePendingShareDto.location
        ? transformLatitudeAndLongitudeToGeoJson(updatePendingShareDto.location)
        : updatePendingShareDto.location,
    };

    this.logger.verbose(
      `{${ctx}} (update pending share) data:\n${prettyObjectString({
        updatedPendingShare,
      })}`,
    );

    return this.pendingSharesRepository.findByIdAndUpdate(pendingShareId, updatedPendingShare);
  }

  @Span('Update Rejected Pending Share')
  async updateRejectedPendingShare(
    user: IUser,
    pendingShareId: string,
    UpdateRejectedPendingShareDto: UpdateRejectedPendingShareDto,
    image: Express.Multer.File,
  ): Promise<PendingShareDocument> {
    const pendingShare = await this.getPrivatePendingShareById(user, pendingShareId);
    const isRejected = pendingShare.submissionStatus === SubmissionStatus.REJECTED;

    if (!isRejected) {
      throw new ErrorException(CODES.TEC_033);
    }

    await this.restoreRejectedPendingShare(user, pendingShareId);

    return this.updatePendingShare(user, pendingShareId, UpdateRejectedPendingShareDto, image);
  }

  @Span('Delete Additional Image Url')
  async deleteAdditionalImageUrl(
    pendingShareId: string,
    fileName: string,
  ): Promise<PendingShareDocument> {
    this.logger.debug(
      `{${PendingSharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        pendingShareId,
        fileName,
      })}`,
    );

    const pendingShare = await this.getPendingShareById(pendingShareId);

    await this.additionalImageService.deleteAdditionalImageUrl(
      fileName,
      pendingShare.additionalImageUrl,
    );

    return this.pendingSharesRepository.findByIdAndUpdate(pendingShareId, {
      $pull: { additionalImageUrl: fileName },
    });
  }

  @Span('Delete Many Pending Shares')
  async deleteMany(filterQuery: FilterQuery<ShareDocument>): Promise<Boolean> {
    this.logger.debug(
      `{${PendingSharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
      })}`,
    );

    const pendingShares = await this.pendingSharesRepository.find(filterQuery, {
      imageUrl: 1,
      additionalImageUrl: 1,
    });

    if (!pendingShares.length) {
      return false;
    }

    const pendingShareImages = [];

    pendingShares.forEach(pendingShare => {
      if (pendingShare.imageUrl) {
        pendingShareImages.push(pendingShare.imageUrl);
      }

      if (pendingShare.additionalImageUrl?.length) {
        pendingShareImages.push(...pendingShare.additionalImageUrl);
      }
    });

    if (pendingShareImages.length) {
      await this.minioClientService.deleteManyFiles(pendingShareImages);
    }

    return this.pendingSharesRepository.deleteMany(filterQuery);
  }

  @Span('Approve Pending Share')
  async approvePendingShare(user: IUser, pendingShareId: string): Promise<ShareDocument> {
    const ctx = `${PendingSharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pendingShareId,
      })}`,
    );

    const pendingShare = await this.getPermissionedPendingShareById(user, pendingShareId);
    const isRejected = pendingShare.submissionStatus === SubmissionStatus.REJECTED;

    if (isRejected) {
      throw new ErrorException(CODES.TEC_035);
    }

    const share = {
      ...pendingShare,
      approvedBy: user._id,
      lastModifiedBy: user._id,
      status: ShareStatus.OPEN,
      submissionStatus: SubmissionStatus.ACCEPTED,
    };

    this.logger.verbose(
      `{${ctx}} (create share when approve pending share) data:\n${prettyObjectString({
        share,
      })}`,
    );

    const createdShare = await this.sharesRepository.create(share);

    this.logger.verbose(
      `{${ctx}} (delete pending share when approve share) data:\n${prettyObjectString({
        pendingShareId,
      })}`,
    );

    await this.pendingSharesRepository.findByIdAndDelete(pendingShareId);

    return createdShare;
  }

  @Span('Reject Pending Share')
  async rejectPendingShare(
    user: IUser,
    pendingShareId: string,
    submissionMessage: string,
  ): Promise<void> {
    const ctx = `${PendingSharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pendingShareId,
        submissionMessage,
      })}`,
    );

    const pendingShare = await this.getPermissionedPendingShareById(user, pendingShareId);
    const isRejected = pendingShare.submissionStatus === SubmissionStatus.REJECTED;

    if (isRejected) {
      throw new ErrorException(CODES.TEC_034);
    }

    const imageUrl = await this.minioClientService.moveFile(
      pendingShare.imageUrl,
      `${MINIO_FOLDER.bin}/${MINIO_FOLDER.shares}`,
    );

    if (!imageUrl) {
      throw new ErrorException(CODES.TEC_054);
    }

    const additionalImageUrl = pendingShare.additionalImageUrl
      ? await this.minioClientService.moveFiles(
          pendingShare.additionalImageUrl,
          MINIO_FOLDER.shares,
          `${MINIO_FOLDER.bin}/${MINIO_FOLDER.shares}`,
        )
      : undefined;

    const rejectPendingShare = {
      submissionStatus: SubmissionStatus.REJECTED,
      submissionMessage,
      rejectedAutoDelete: new Date(),
      imageUrl,
      additionalImageUrl,
    };

    this.logger.verbose(
      `{${ctx}} (update pending share when reject) data:\n${prettyObjectString({
        rejectPendingShare,
      })}`,
    );

    await this.pendingSharesRepository.findByIdAndUpdate(pendingShareId, rejectPendingShare);
  }

  @Span('Upload Additional Image')
  async uploadAdditionalImage(user: IUser, images: Array<Express.Multer.File>): Promise<string[]> {
    this.logger.debug(
      `{${PendingSharesService.name}-[${getSpanName()}]} (called)\
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

  @Span('Restore Rejected Pending Share')
  async restoreRejectedPendingShare(
    user: IUser,
    pendingShareId: string,
  ): Promise<PendingShareDocument> {
    const ctx = `${PendingSharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        pendingShareId,
      })}`,
    );

    const pendingShare = await this.getPrivatePendingShareById(user, pendingShareId);
    const isRejected = pendingShare.submissionStatus === SubmissionStatus.REJECTED;

    if (!isRejected) {
      throw new ErrorException(CODES.TEC_059);
    }

    const imageUrl = await this.minioClientService.moveFile(
      pendingShare.imageUrl,
      MINIO_FOLDER.shares,
    );

    if (!imageUrl) {
      throw new ErrorException(CODES.TEC_054);
    }

    const additionalImageUrl = pendingShare?.additionalImageUrl
      ? await this.minioClientService.moveFiles(
          pendingShare.additionalImageUrl,
          `${MINIO_FOLDER.bin}/${MINIO_FOLDER.shares}`,
          MINIO_FOLDER.shares,
        )
      : undefined;

    const updatePendingShare = {
      imageUrl,
      submissionStatus: SubmissionStatus.PENDING,
      submissionMessage: '',
      rejectedAutoDelete: null,
      rejectedCompletelyDeleteAt: null,
      additionalImageUrl,
    };

    this.logger.verbose(
      `{${ctx}} (update pending share when restore) data:\n${prettyObjectString({
        pendingShare,
      })}`,
    );

    return this.pendingSharesRepository.findByIdAndUpdate(pendingShareId, updatePendingShare);
  }

  @Span('Check If District Id Valid')
  private async checkIfDistrictIdValid(districtId: string) {
    this.logger.debug(
      `{${PendingSharesService.name}-[${getSpanName()}]} (called)\
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
    const ctx = `${PendingSharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
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
    const ctx = `${PendingSharesService.name}-[${getSpanName()}]`;

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
