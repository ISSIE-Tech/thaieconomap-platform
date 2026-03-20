import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { Span } from 'nestjs-otel';

import { ErrorException } from '../../../common/exceptions';
import { CODES } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';
import { getSpanName, isEntitiesIdValid, prettyObjectString } from '../../../shared/utils';
import { CreateShareTypeDto } from '../dto';
import { ShareTypesRepository } from '../repositories';
import { ShareTypeDocument } from '../schemas';

import { AllSharesService } from './all-shares.service';

@Injectable()
export class ShareTypesService {
  private readonly logger: Logger = new Logger(ShareTypesService.name);

  constructor(
    private readonly shareTypesRepository: ShareTypesRepository,

    @Inject(forwardRef(() => AllSharesService))
    private readonly allSharesService: AllSharesService,
  ) {}

  @Span('Get Share Types')
  async getShareTypes(): Promise<ShareTypeDocument[]> {
    this.logger.debug(`{${ShareTypesService.name}-[${getSpanName()}]} (called)`);

    return this.shareTypesRepository.find({});
  }

  @Span('Get Share Type By Id')
  async getShareTypeById(shareTypeId: string): Promise<ShareTypeDocument> {
    this.logger.debug(
      `{${ShareTypesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        shareTypeId,
      })}`,
    );

    const shareType = await this.shareTypesRepository.findById(shareTypeId);

    if (!shareType) {
      throw new ErrorException(CODES.TEC_021);
    }

    return shareType;
  }

  @Span('Check If Share Types Valid')
  async checkIfShareTypesValid(shareTypeIds: string[]): Promise<void> {
    const ctx = `${ShareTypesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        shareTypeIds,
      })}`,
    );

    const { isValid, missing } = await isEntitiesIdValid<ShareTypeDocument>(
      shareTypeIds,
      this.shareTypesRepository,
    );

    this.logger.verbose(
      `{${ctx}} (current isValid and missing) data:\n${prettyObjectString({
        isValid,
        missing,
      })}`,
    );

    if (!isValid) {
      throw new ErrorException(CODES.TEC_021, undefined, `${CODES.TEC_021.message}: ${missing}`);
    }
  }

  @Span('Create Share Type')
  async createShareType(
    user: IUser,
    createShareTypeDto: CreateShareTypeDto,
  ): Promise<ShareTypeDocument> {
    const ctx = `${ShareTypesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
    \n[param] ${prettyObjectString({
      user,
      createShareTypeDto,
    })}`,
    );

    const shareType = {
      ...createShareTypeDto,
      createdBy: user._id,
    };

    this.logger.verbose(
      `{${ctx}} (create share type) data:\n${prettyObjectString({
        shareType,
      })}`,
    );

    return this.shareTypesRepository.create(shareType);
  }

  @Span('Delete Share Type')
  async deleteShareType(shareTypeId: string): Promise<ShareTypeDocument> {
    const ctx = `{${ShareTypesService.name}-[${getSpanName()}]}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        shareTypeId,
      })}`,
    );

    await this.getShareTypeById(shareTypeId);

    const type = shareTypeId;
    const isShareExists = await this.allSharesService.isShareExists({ types: { $in: type } });

    if (isShareExists) {
      throw new ErrorException(CODES.TEC_055);
    }

    this.logger.verbose(`{${ctx}} (removing share type)`);

    return this.shareTypesRepository.findByIdAndDelete(shareTypeId);
  }
}
