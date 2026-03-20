import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { Span } from 'nestjs-otel';

import { ErrorException } from '../../../common/exceptions';
import { CODES } from '../../../shared/constants';
import { getSpanName, prettyObjectString } from '../../../shared/utils';
import { CreateConditionOptionDto } from '../dto';
import { ConditionOptionsRepository } from '../repositories';
import { ConditionOptionDocument } from '../schemas';

import { AllSharesService } from './all-shares.service';

@Injectable()
export class ConditionOptionsService {
  private readonly logger: Logger = new Logger(ConditionOptionsService.name);

  constructor(
    private readonly conditionOptionsRepository: ConditionOptionsRepository,

    @Inject(forwardRef(() => AllSharesService))
    private readonly allSharesService: AllSharesService,
  ) {}

  @Span('Get All Condition Options')
  async getAllConditionOptions(): Promise<ConditionOptionDocument[]> {
    this.logger.debug(`{${ConditionOptionsService.name}-[${getSpanName()}]} (called)`);

    return this.conditionOptionsRepository.find({});
  }

  @Span('Get Condition Option By Id')
  async getConditionOptionById(conditionOptionId: string): Promise<ConditionOptionDocument> {
    this.logger.debug(
      `{${ConditionOptionsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        conditionOptionId,
      })}`,
    );

    const conditionOption = await this.conditionOptionsRepository.findById(conditionOptionId);

    if (!conditionOption) {
      throw new ErrorException(CODES.TEC_020);
    }

    return conditionOption;
  }

  @Span('Create Condition Option')
  async createConditionOption(
    userId: string,
    createConditionOptionDto: CreateConditionOptionDto,
  ): Promise<ConditionOptionDocument> {
    const ctx = `${ConditionOptionsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        userId,
        createConditionOptionDto,
      })}`,
    );

    const conditionOption = {
      ...createConditionOptionDto,
      createdBy: userId,
    };

    this.logger.verbose(
      `{${ctx}} (create condition option) data:\n${prettyObjectString({
        conditionOption,
      })}`,
    );

    return this.conditionOptionsRepository.create(conditionOption);
  }

  @Span('Delete Condition Option')
  async deleteConditionOption(conditionOptionId: string): Promise<ConditionOptionDocument> {
    const ctx = `{${ConditionOptionsService.name}-[${getSpanName()}]}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        conditionOptionId,
      })}`,
    );

    await this.getConditionOptionById(conditionOptionId);

    const condition = conditionOptionId;
    const isShareExists = await this.allSharesService.isShareExists({ condition });

    if (isShareExists) {
      throw new ErrorException(CODES.TEC_056);
    }

    this.logger.verbose(`{${ctx}} (removing condition option)`);

    return this.conditionOptionsRepository.findByIdAndDelete(conditionOptionId);
  }
}
