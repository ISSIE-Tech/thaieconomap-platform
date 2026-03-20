import { Injectable, Logger } from '@nestjs/common';

import { SubmissionStatus } from '@thaieconomap/contracts';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../../common/exceptions';
import { AdditionalImageService } from '../../../modules/additional-image';
import { MinioClientService } from '../../../modules/minio-client/minio-client.service';
import { CODES, MINIO_FOLDER } from '../../../shared/constants';
import { IPaginationQuery, IPaginationResponse, IUser } from '../../../shared/interfaces';
import {
  checkDistrictPermission,
  getSpanName,
  isManagerUser,
  prettyObjectString,
} from '../../../shared/utils';
import { GetDeletedSharesQueryDto } from '../dto';
import { DeletedSharesRepository, SharesRepository } from '../repositories';
import { DeletedShareDocument, ShareDocument } from '../schemas';

@Injectable()
export class DeletedSharesService {
  private readonly logger: Logger = new Logger(DeletedSharesService.name);

  constructor(
    private readonly sharesRepository: SharesRepository,
    private readonly deletedSharesRepository: DeletedSharesRepository,
    private readonly minioClientService: MinioClientService,
    private readonly additionalImageService: AdditionalImageService,
  ) {}

  @Span('Get One Deleted Share')
  async getOne(
    filterQuery: FilterQuery<DeletedShareDocument>,
    projection?: ProjectionType<DeletedShareDocument>,
    options?: QueryOptions<DeletedShareDocument>,
  ): Promise<DeletedShareDocument> {
    this.logger.debug(
      `{${DeletedSharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
        projection,
        options,
      })}`,
    );

    return this.deletedSharesRepository.findOne(filterQuery, projection, options);
  }

  @Span('Get All Deleted Shares')
  async getAllDeletedShare(user: IUser): Promise<DeletedShareDocument[]> {
    this.logger.debug(
      `{${DeletedSharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        role: user.roles.TEC,
      })}`,
    );

    const filter = isManagerUser(user) ? { district: user.districts } : {};

    return this.deletedSharesRepository.find(filter, {});
  }

  @Span('Get Paginated Deleted Shares')
  async getPaginatedDeletedShares(
    user: IUser,
    getDeletedSharesFiltersDto: GetDeletedSharesQueryDto,
  ): Promise<IPaginationResponse<DeletedShareDocument>> {
    const ctx = `${DeletedSharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        getDeletedSharesFiltersDto,
      })}`,
    );

    const query: IPaginationQuery<DeletedShareDocument> = getDeletedSharesFiltersDto;
    const projection = {
      detail: 0,
      moreDetail: 0,
      rejectedAutoDelete: 0,
      rejectedCompletelyDeletedAt: 0,
      requests: 0,
      approvedAt: 0,
      approvedBy: 0,
      lastModifiedBy: 0,
      submissionMessage: 0,
      deletedAutoDelete: 0,
      createdBy: 0,
    };

    if (query.types) {
      query.types = { $in: query.types };
    }

    if (isManagerUser(user)) {
      query.district = user.districts;
    }

    this.logger.verbose(
      `{${ctx}} (find paginate deleted shares) query:\n${prettyObjectString({
        query,
      })}`,
    );

    return this.deletedSharesRepository.findWithPagination(query, ['name'], projection);
  }

  @Span('Get Deleted Share By Id')
  async getDeletedShareById(deletedShareId: string): Promise<DeletedShareDocument> {
    this.logger.debug(
      `{${DeletedSharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        deletedShareId,
      })}`,
    );

    const deletedShare = await this.deletedSharesRepository.findById(deletedShareId);

    if (!deletedShare) {
      throw new ErrorException(CODES.TEC_024);
    }

    return deletedShare;
  }

  @Span('Restore Deleted Share')
  async restoreDeletedShare(user: IUser, deletedShareId: string): Promise<ShareDocument> {
    const ctx = `${DeletedSharesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        deletedShareId,
      })}`,
    );

    const deletedShare = await this.getDeletedShareById(deletedShareId);
    const districtId = deletedShare.district._id.toString();

    this.checkDistrictPermission(user, districtId);

    const imageUrl = await this.minioClientService.moveFile(
      deletedShare.imageUrl,
      MINIO_FOLDER.shares,
    );

    if (!imageUrl) {
      throw new ErrorException(CODES.TEC_054);
    }

    const additionalImageUrl = deletedShare?.additionalImageUrl
      ? await this.minioClientService.moveFiles(
          deletedShare.additionalImageUrl,
          `${MINIO_FOLDER.bin}/${MINIO_FOLDER.shares}`,
          MINIO_FOLDER.shares,
        )
      : undefined;

    const restoreShare = {
      ...deletedShare,
      _id: deletedShare._id,
      rejectedAutoDelete: undefined,
      submissionStatus: SubmissionStatus.ACCEPTED,
      imageUrl,
      additionalImageUrl,
    };

    this.logger.verbose(
      `{${ctx}} (create share when restore deleted share) data:\n${prettyObjectString({
        restoreShare,
      })}`,
    );

    const restoredShare = await this.sharesRepository.create(restoreShare);

    await this.deletedSharesRepository.findByIdAndDelete(deletedShareId);

    return restoredShare;
  }

  @Span('Delete Deleted Share')
  async deleteDeletedShare(user: IUser, deletedShareId: string): Promise<DeletedShareDocument> {
    this.logger.debug(
      `{${DeletedSharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
        deletedShareId,
      })}`,
    );

    const deletedShare = await this.getDeletedShareById(deletedShareId);
    const districtId = deletedShare.district._id.toString();

    this.checkDistrictPermission(user, districtId);

    await this.minioClientService.deleteFile(deletedShare.imageUrl);

    if (deletedShare.additionalImageUrl?.length) {
      await this.additionalImageService.deleteManyAdditionalImage(deletedShare.additionalImageUrl);
    }

    return this.deletedSharesRepository.findByIdAndDelete(deletedShareId);
  }

  @Span('Delete Many Deleted Shares')
  async deleteMany(filterQuery: FilterQuery<ShareDocument>): Promise<boolean> {
    this.logger.debug(
      `{${DeletedSharesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
      })}`,
    );

    const deletedShares = await this.deletedSharesRepository.find(filterQuery, { imageUrl: 1 });
    const deletedShareImages = [];

    if (!deletedShares.length) {
      return false;
    }

    deletedShares.forEach(deletedShare => {
      if (deletedShare.imageUrl) {
        deletedShareImages.push(deletedShare.imageUrl);
      }

      if (deletedShare.additionalImageUrl?.length) {
        deletedShareImages.push(...deletedShare.additionalImageUrl);
      }
    });

    if (deletedShareImages.length) {
      await this.minioClientService.deleteManyFiles(deletedShareImages);
    }

    return this.deletedSharesRepository.deleteMany(filterQuery);
  }

  @Span('Check District Permission')
  private checkDistrictPermission(user: IUser, districtId: string): void {
    const ctx = `${DeletedSharesService.name}-[${getSpanName()}]`;

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
}
