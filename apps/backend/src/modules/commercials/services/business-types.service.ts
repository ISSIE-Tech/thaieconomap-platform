import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { CommercialCategory } from '@thaieconomap/contracts';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../../common/exceptions';
import { CODES } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';
import { getSpanName, prettyObjectString } from '../../../shared/utils';
import { CreateBusinessTypeDto } from '../dto';
import { BusinessTypesRepository } from '../repositories';
import { BusinessTypeDocument } from '../schemas';

import { AllCommercialsService } from './all-commercials.service';

@Injectable()
export class BusinessTypesService {
  private readonly logger: Logger = new Logger(BusinessTypesService.name);

  constructor(
    private readonly businessTypesRepository: BusinessTypesRepository,

    @Inject(forwardRef(() => AllCommercialsService))
    private readonly allCommercialsService: AllCommercialsService,
  ) {}

  @Span('Get Business Types')
  async getBusinessTypes(): Promise<BusinessTypeDocument[]> {
    this.logger.debug(`{${BusinessTypesService.name}-[${getSpanName()}]} (called)`);

    return this.businessTypesRepository.find({});
  }

  @Span('Get Business Type By Id Or Throw')
  async getBusinessTypeByIdOrThrow(businessTypeId: string): Promise<BusinessTypeDocument> {
    this.logger.debug(
      `{${BusinessTypesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        businessTypeId,
      })}`,
    );

    const businessType = await this.businessTypesRepository.findById(businessTypeId);

    if (!businessType) {
      throw new ErrorException(CODES.TEC_045);
    }

    return businessType;
  }

  @Span('Get Business Type By Ids')
  async getBusinessTypeByIds(businessTypeIds: string[]): Promise<BusinessTypeDocument[]> {
    this.logger.debug(
      `{${BusinessTypesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        businessTypeIds,
      })}`,
    );

    return this.businessTypesRepository.find({
      _id: { $in: businessTypeIds },
    });
  }

  @Span('Create Business Type')
  async createBusinessType(
    user: IUser,
    createBusinessTypeDto: CreateBusinessTypeDto,
  ): Promise<BusinessTypeDocument> {
    const ctx = `${BusinessTypesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        createBusinessTypeDto,
      })}`,
    );

    const businessTypeExists = await this.businessTypesRepository.findOne({
      name: createBusinessTypeDto.name,
    });

    if (businessTypeExists) {
      throw new ErrorException(CODES.TEC_046);
    }

    const businessType = {
      ...createBusinessTypeDto,
      createdBy: user._id,
    };

    this.logger.verbose(
      `{${ctx}} (create Business type) data:\n${prettyObjectString({
        businessType,
      })}`,
    );

    return this.businessTypesRepository.create(businessType);
  }

  @Span('Update Business Type')
  async deleteBusinessType(businessTypeId: string): Promise<BusinessTypeDocument> {
    const ctx = `${BusinessTypesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        businessTypeId,
      })}`,
    );

    await this.getBusinessTypeByIdOrThrow(businessTypeId);

    const type = businessTypeId;
    const isCommercialExists = await this.allCommercialsService.isCommercialExists({
      types: {
        $in: [type],
      },
      category: CommercialCategory.BUSINESS,
    });

    if (isCommercialExists) {
      throw new ErrorException(CODES.TEC_053);
    }

    this.logger.verbose(`{${ctx}} (removing Business type)`);

    return this.businessTypesRepository.findByIdAndDelete(businessTypeId);
  }
}
