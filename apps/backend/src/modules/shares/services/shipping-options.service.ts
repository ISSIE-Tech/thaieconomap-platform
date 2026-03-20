import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { Span } from 'nestjs-otel';

import { ErrorException } from '../../../common/exceptions';
import { UserDocument } from '../../../modules/users/schemas';
import { CODES } from '../../../shared/constants';
import { getSpanName, prettyObjectString } from '../../../shared/utils';
import { CreateShippingOptionDto } from '../dto';
import { ShippingOptionsRepository } from '../repositories';
import { ShippingOptionDocument } from '../schemas';

import { AllSharesService } from './all-shares.service';

@Injectable()
export class ShippingOptionsService {
  private readonly logger: Logger = new Logger(ShippingOptionsService.name);
  constructor(
    private readonly shippingOptionsRepository: ShippingOptionsRepository,

    @Inject(forwardRef(() => AllSharesService))
    private readonly allSharesService: AllSharesService,
  ) {}

  @Span('Get Shipping Options')
  async getShippingOptions(): Promise<ShippingOptionDocument[]> {
    this.logger.debug(`{${ShippingOptionsService.name}-[${getSpanName()}]} (called)`);

    return this.shippingOptionsRepository.find({});
  }

  @Span('Get Shipping Option By Id')
  async getShippingOptionById(shippingOptionId: string): Promise<ShippingOptionDocument> {
    this.logger.debug(
      `{${ShippingOptionsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        shippingOptionId,
      })}`,
    );

    const shippingOption = await this.shippingOptionsRepository.findById(shippingOptionId);

    if (!shippingOption) {
      throw new ErrorException(CODES.TEC_022);
    }

    return shippingOption;
  }

  @Span('Create Shipping Option')
  async createShippingOption(
    user: UserDocument,
    createShippingOptionDto: CreateShippingOptionDto,
  ): Promise<ShippingOptionDocument> {
    const ctx = `${ShippingOptionsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        createShippingOptionDto,
      })}`,
    );

    const shippingOption = {
      ...createShippingOptionDto,
      createdBy: user._id,
    };

    this.logger.verbose(
      `{${ctx}} (create shipping option) data:\n${prettyObjectString({
        shippingOption,
      })}`,
    );

    return this.shippingOptionsRepository.create(shippingOption);
  }

  @Span('Delete Shipping Option')
  async deleteShippingOption(shippingOptionId: string): Promise<ShippingOptionDocument> {
    const ctx = `{${ShippingOptionsService.name}-[${getSpanName()}]}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        shippingOptionId,
      })}`,
    );

    await this.getShippingOptionById(shippingOptionId);

    const shipping = shippingOptionId;
    const isShareExists = await this.allSharesService.isShareExists({ shipping });

    if (isShareExists) {
      throw new ErrorException(CODES.TEC_057);
    }

    this.logger.verbose(`{${ctx}} (removing shipping option)`);

    return this.shippingOptionsRepository.findByIdAndDelete(shippingOptionId);
  }
}
