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
import { GetDeletedCommercialsQueryDto } from '../dto';
import { CommercialsRepository, DeletedCommercialsRepository } from '../repositories';
import { CommercialDocument, DeletedCommercial, DeletedCommercialDocument } from '../schemas';

@Injectable()
export class DeletedCommercialsService {
  constructor(
    private readonly commercialsRepository: CommercialsRepository,
    private readonly deletedCommercialsRepository: DeletedCommercialsRepository,
    private readonly minioClientService: MinioClientService,
    private readonly additionalImageService: AdditionalImageService,
  ) {}

  private readonly logger: Logger = new Logger(DeletedCommercialsService.name);
  private basePopulation = ['district', 'createdBy', 'types'];

  @Span('Get One Deleted Commercial')
  async getOne(
    filterQuery: FilterQuery<DeletedCommercialDocument>,
    projection?: ProjectionType<DeletedCommercialDocument>,
    options?: QueryOptions<DeletedCommercialDocument>,
  ): Promise<DeletedCommercialDocument> {
    this.logger.debug(
      `{${DeletedCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
        projection,
        options,
      })}`,
    );

    return this.deletedCommercialsRepository.findOne(filterQuery, projection, options);
  }

  @Span('Get All Deleted Commercials')
  async getAllDeletedCommercials(user: IUser): Promise<DeletedCommercialDocument[]> {
    this.logger.debug(
      `{${DeletedCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        roles: user.roles.TEC,
      })}`,
    );

    const filter = isManagerUser(user) ? { district: user.districts } : {};

    return this.deletedCommercialsRepository.find(filter, {}, { populate: this.basePopulation });
  }

  @Span('Get Deleted Commercials')
  async getDeletedCommercials(
    user: IUser,
    getDeletedCommercialsQueryDto: GetDeletedCommercialsQueryDto,
  ): Promise<IPaginationResponse<DeletedCommercialDocument>> {
    const ctx = `${DeletedCommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        getDeletedCommercialsQueryDto,
      })}`,
    );

    const query: IPaginationQuery<DeletedCommercialDocument> = getDeletedCommercialsQueryDto;

    if (query?.types) {
      query.types = { $in: query.types };
    }

    this.logger.verbose(
      `{${ctx}} (find paginate deleted commercial) query:\n${prettyObjectString({
        query,
      })}`,
    );

    return this.deletedCommercialsRepository.findWithPagination(
      query,
      ['name'],
      {},
      this.basePopulation,
    );
  }

  @Span('Get Deleted Commercial By Id')
  async getDeletedCommercialById(
    user: IUser,
    deletedCommercialId: string,
  ): Promise<DeletedCommercialDocument> {
    this.logger.debug(
      `{${DeletedCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
        deletedCommercialId,
      })}`,
    );

    const deletedCommercial = await this.deletedCommercialsRepository.findById(deletedCommercialId);

    if (!deletedCommercial) {
      throw new ErrorException(CODES.TEC_009);
    }

    const districtId = deletedCommercial.district._id.toString();

    this.checkDistrictPermission(user, districtId);

    return deletedCommercial;
  }

  @Span('Restore Deleted Commercial')
  async restoreDeletedCommercial(
    user: IUser,
    deletedCommercialId: string,
  ): Promise<CommercialDocument> {
    const ctx = `${DeletedCommercialsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        deletedCommercialId,
      })}`,
    );

    const deletedCommercial = await this.getDeletedCommercialById(user, deletedCommercialId);
    const imageUrl = await this.minioClientService.moveFile(
      deletedCommercial.imageUrl,
      MINIO_FOLDER.commercials,
    );

    if (!imageUrl) {
      throw new ErrorException(CODES.TEC_054);
    }

    const additionalImageUrl = deletedCommercial?.additionalImageUrl
      ? await this.minioClientService.moveFiles(
          deletedCommercial.additionalImageUrl,
          `${MINIO_FOLDER.bin}/${MINIO_FOLDER.commercials}`,
          MINIO_FOLDER.commercials,
        )
      : undefined;

    const commercial = {
      ...deletedCommercial,
      submissionStatus: SubmissionStatus.ACCEPTED,
      imageUrl,
      additionalImageUrl,
    };

    this.logger.verbose(
      `{${ctx}} (create commercial when restore deleted commercial) data:\n${prettyObjectString({
        commercial,
      })}`,
    );

    const restoredCommercial = await this.commercialsRepository.create(commercial);

    await this.deletedCommercialsRepository.findByIdAndDelete(deletedCommercialId);

    return restoredCommercial;
  }

  @Span('Delete Deleted Commercial')
  async deleteDeletedCommercial(
    user: IUser,
    deletedCommercialId: string,
  ): Promise<DeletedCommercialDocument> {
    this.logger.debug(
      `{${DeletedCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        user,
        deletedCommercialId,
      })}`,
    );

    const deletedCommercial = await this.getDeletedCommercialById(user, deletedCommercialId);
    const districtId = deletedCommercial.district._id.toString();

    this.checkDistrictPermission(user, districtId);

    await this.minioClientService.deleteFile(deletedCommercial.imageUrl);

    if (deletedCommercial.additionalImageUrl?.length) {
      await this.additionalImageService.deleteManyAdditionalImage(
        deletedCommercial.additionalImageUrl,
      );
    }

    return this.deletedCommercialsRepository.findByIdAndDelete(deletedCommercialId);
  }

  @Span('Check District Permission')
  private checkDistrictPermission(user: IUser, districtId: string): void {
    const ctx = `${DeletedCommercialsService.name}-[${getSpanName()}]`;

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

  @Span('Delete Many Deleted Commercials')
  async deleteMany(filterQuery: FilterQuery<DeletedCommercial>): Promise<boolean> {
    this.logger.debug(
      `{${DeletedCommercialsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
      })}`,
    );

    const deletedCommercials = await this.deletedCommercialsRepository.find(filterQuery, {
      imageUrl: 1,
    });

    const deletedCommercialImages = [];

    if (!deletedCommercials.length) {
      return false;
    }

    deletedCommercials.forEach(deletedCommercial => {
      if (deletedCommercial.imageUrl) {
        deletedCommercialImages.push(deletedCommercial.imageUrl);
      }
    });

    if (deletedCommercialImages.length) {
      await this.minioClientService.deleteManyFiles(deletedCommercialImages);
    }

    return this.deletedCommercialsRepository.deleteMany(filterQuery);
  }
}
