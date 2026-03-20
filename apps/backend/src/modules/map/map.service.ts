import { Injectable, Logger } from '@nestjs/common';

import { FilterQuery } from 'mongoose';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../common/exceptions';
import { CODES } from '../../shared/constants';
import { IValidEntity } from '../../shared/interfaces';
import { getSpanName, isEntitiesIdValid, prettyObjectString } from '../../shared/utils';

import { DistrictsRepository } from './districts.repository';
import { GetDistrictsFilterDto } from './dto';
import { DistrictDocument } from './schemas';

@Injectable()
export class MapService {
  constructor(private readonly districtsRepository: DistrictsRepository) {}

  private readonly logger: Logger = new Logger(MapService.name);

  @Span('Get Districts')
  async getDistricts(getDistrictsFilterDto: GetDistrictsFilterDto): Promise<DistrictDocument[]> {
    const ctx = `${MapService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}}} (called)\
      \n[param] ${prettyObjectString({
        ...getDistrictsFilterDto,
      })}`,
    );

    return this.districtsRepository.find(getDistrictsFilterDto);
  }

  @Span('Get Provinces')
  async getProvinces(): Promise<DistrictDocument[]> {
    this.logger.debug(`{${MapService.name}-[${getSpanName()}]} (called)`);

    return this.districtsRepository.findProvince();
  }

  @Span('Get One District By Filters')
  async getOneDistrictByFilters(filters: FilterQuery<DistrictDocument>) {
    const ctx = `${MapService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        ...filters,
      })}`,
    );

    return this.districtsRepository.findOne(filters);
  }

  @Span('Get District By Id')
  async getDistrictById(districtId: string) {
    const ctx = `${MapService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        districtId,
      })}`,
    );

    const district = await this.districtsRepository.findById(districtId);

    if (!district) {
      throw new ErrorException(CODES.TEC_017);
    }

    return district;
  }

  @Span('Is Districts Id Valid')
  async isDistrictsIdValid(districtsId: string[]): Promise<IValidEntity> {
    const ctx = `${MapService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        districtsId,
      })}`,
    );

    const { isValid, missing } = await isEntitiesIdValid<DistrictDocument>(
      districtsId,
      this.districtsRepository,
    );

    this.logger.verbose(
      `{${ctx}} (current isValid and missing) data:\n${prettyObjectString({
        isValid,
        missing,
      })}`,
    );

    return { isValid, missing };
  }
}
