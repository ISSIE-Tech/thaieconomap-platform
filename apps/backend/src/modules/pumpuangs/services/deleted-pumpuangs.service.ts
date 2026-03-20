import { Injectable, Logger } from '@nestjs/common';

import { SubmissionStatus } from '@thaieconomap/contracts';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';

import { ErrorException } from '../../../common/exceptions';
import { AdditionalImageService } from '../../../modules/additional-image';
import { MinioClientService } from '../../../modules/minio-client/minio-client.service';
import { DeletedSharesService } from '../../../modules/shares/services';
import { CODES, MINIO_FOLDER } from '../../../shared/constants';
import { IPaginationQuery, IPaginationResponse, IUser } from '../../../shared/interfaces';
import { prettyObjectString } from '../../../shared/utils';
import { GetDeletedPumpuangsQueryDto } from '../dto';
import { DeletedPumpuangRepository, PumpuangRepository } from '../repositories';
import { DeletedPumpuangDocument, PumpuangDocument } from '../schemas';

@Injectable()
export class DeletedPumpuangsService {
  private readonly logger: Logger = new Logger(DeletedPumpuangsService.name);
  private basePopulation = ['types'];

  constructor(
    private readonly deletedPumpuangRepository: DeletedPumpuangRepository,
    private readonly minioClientService: MinioClientService,
    private readonly additionalImageService: AdditionalImageService,

    private readonly pumpuangRepository: PumpuangRepository,
  ) {}

  async getOne(
    filterQuery: FilterQuery<PumpuangDocument>,
    projection?: ProjectionType<PumpuangDocument>,
    options?: QueryOptions<PumpuangDocument>,
  ): Promise<PumpuangDocument> {
    this.logger.debug(
      `{${DeletedPumpuangsService.name}-${this.getOne.name}} (called)\
      \n[param] ${prettyObjectString({
        filterQuery,
        projection,
        options,
      })}`,
    );

    return this.pumpuangRepository.findOne(filterQuery, projection, options);
  }

  async getDeletedPumpuangs(
    user: IUser,
    getDeletedPumpuangsQueryDto: GetDeletedPumpuangsQueryDto,
  ): Promise<IPaginationResponse<DeletedPumpuangDocument>> {
    const ctx = `{${DeletedSharesService.name}-${this.getDeletedPumpuangs.name}}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        getDeletedPumpuangsQueryDto,
      })}`,
    );

    const query: IPaginationQuery<DeletedPumpuangDocument> = getDeletedPumpuangsQueryDto;

    if (query?.types) {
      query.types = { $in: query.types };
    }

    this.logger.verbose(
      `{${ctx}} (find paginate deleted pumpuang) query:\n${prettyObjectString({
        query,
      })}`,
    );

    return this.deletedPumpuangRepository.findWithPagination(
      query,
      ['name'],
      {},
      this.basePopulation,
    );
  }

  async getDeletedPumpuangById(
    user: IUser,
    deletedPumpuangId: string,
  ): Promise<DeletedPumpuangDocument> {
    this.logger.debug(
      `{${DeletedSharesService.name}-${this.getDeletedPumpuangById.name}} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        deletedPumpuangId,
      })}`,
    );

    const deletedPumpuang = await this.deletedPumpuangRepository.findById(deletedPumpuangId);

    if (!deletedPumpuang) {
      throw new ErrorException(CODES.TEC_071);
    }

    return deletedPumpuang;
  }

  async getAllDeletedPumpuang(): Promise<DeletedPumpuangDocument[]> {
    this.logger.debug(
      `{${DeletedPumpuangsService.name}-${this.getAllDeletedPumpuang.name}} (called)`,
    );

    return this.deletedPumpuangRepository.find({}, undefined, { populate: this.basePopulation });
  }

  async deleteDeletedPumpuangById(
    user: IUser,
    deletedPumpuangId: string,
  ): Promise<DeletedPumpuangDocument> {
    this.logger.debug(
      `{${DeletedPumpuangsService.name}-${this.deleteDeletedPumpuangById.name}} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        deletedPumpuangId,
      })}`,
    );

    const deletedPumpuang = await this.getDeletedPumpuangById(user, deletedPumpuangId);

    await this.minioClientService.deleteFile(deletedPumpuang.imageUrl);

    if (deletedPumpuang?.additionalImageUrl?.length) {
      await this.additionalImageService.deleteManyAdditionalImage(
        deletedPumpuang.additionalImageUrl,
      );
    }

    return this.deletedPumpuangRepository.findByIdAndDelete(deletedPumpuangId);
  }

  async restoreDeletedPumpuang(user: IUser, deletedPumpuangId: string): Promise<PumpuangDocument> {
    const ctx = `${DeletedPumpuangsService.name}-${this.restoreDeletedPumpuang.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        deletedPumpuangId,
      })}`,
    );

    const deletedPumpuang = await this.getDeletedPumpuangById(user, deletedPumpuangId);
    const imageUrl = await this.minioClientService.moveFile(
      deletedPumpuang.imageUrl,
      MINIO_FOLDER.pumpuang,
    );

    if (!imageUrl) {
      throw new ErrorException(CODES.TEC_054);
    }

    const additionalImageUrl = deletedPumpuang?.additionalImageUrl
      ? await this.minioClientService.moveFiles(
          deletedPumpuang.additionalImageUrl,
          `${MINIO_FOLDER.bin}/${MINIO_FOLDER.pumpuang}`,
          MINIO_FOLDER.pumpuang,
        )
      : undefined;

    const pumpuang = {
      ...deletedPumpuang,
      submissionStatus: SubmissionStatus.ACCEPTED,
      imageUrl,
      additionalImageUrl,
    };

    const pumpuangPhoneNumberExists = await this.pumpuangRepository.findOne({
      phoneNumber: deletedPumpuang.phoneNumber,
    });

    if (pumpuangPhoneNumberExists) {
      throw new ErrorException(CODES.TEC_073);
    }

    this.logger.verbose(
      `{${ctx}} (create commercial when restore deleted commercial) data:\n${prettyObjectString({
        pumpuang,
      })}`,
    );

    const restoredPumpuang = await this.pumpuangRepository.create(pumpuang);

    await this.deletedPumpuangRepository.findByIdAndDelete(deletedPumpuangId);

    return restoredPumpuang;
  }
}
