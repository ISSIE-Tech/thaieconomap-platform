import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { CommercialCategory } from '@thaieconomap/contracts';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../../common/exceptions';
import { CODES } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';
import { getSpanName, prettyObjectString } from '../../../shared/utils';
import { CreateRestaurantTypeDto } from '../dto';
import { RestaurantTypesRepository } from '../repositories';
import { RestaurantTypeDocument } from '../schemas';

import { AllCommercialsService } from './all-commercials.service';

@Injectable()
export class RestaurantTypesService {
  private readonly logger: Logger = new Logger(RestaurantTypesService.name);

  constructor(
    private readonly restaurantTypesRepository: RestaurantTypesRepository,

    @Inject(forwardRef(() => AllCommercialsService))
    private readonly allCommercialsService: AllCommercialsService,
  ) {}

  @Span('Get Restaurant Types')
  async getRestaurantTypes(): Promise<RestaurantTypeDocument[]> {
    this.logger.debug(`{${RestaurantTypesService.name}-[${getSpanName()}]} (called)`);

    return this.restaurantTypesRepository.find({});
  }

  @Span('Get Restaurant Type By Id Or Throw')
  async getRestaurantTypeByIdOrThrow(restaurantTypeId: string): Promise<RestaurantTypeDocument> {
    this.logger.debug(
      `{${RestaurantTypesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        restaurantTypeId,
      })}`,
    );

    const restaurantType = await this.restaurantTypesRepository.findById(restaurantTypeId);

    if (!restaurantType) {
      throw new ErrorException(CODES.TEC_044);
    }

    return restaurantType;
  }

  @Span('Get Restaurant Type By Ids')
  async getRestaurantTypeByIds(restaurantTypeId: string[]): Promise<RestaurantTypeDocument[]> {
    this.logger.debug(
      `{${RestaurantTypesService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        restaurantTypeId,
      })}`,
    );

    return this.restaurantTypesRepository.find({
      _id: { $in: restaurantTypeId },
    });
  }

  @Span('Create Restaurant Type')
  async createRestaurantType(
    user: IUser,
    createRestaurantTypeDto: CreateRestaurantTypeDto,
  ): Promise<RestaurantTypeDocument> {
    const ctx = `${RestaurantTypesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        createRestaurantTypeDto,
      })}`,
    );

    const restaurantTypeExists = await this.restaurantTypesRepository.findOne({
      name: createRestaurantTypeDto.name,
    });

    if (restaurantTypeExists) {
      throw new ErrorException(CODES.TEC_047);
    }

    const restaurantType = {
      ...createRestaurantTypeDto,
      createdBy: user._id,
    };

    this.logger.verbose(
      `{${ctx}} (create restaurant type) data:\n${prettyObjectString({
        restaurantType,
      })}`,
    );

    return this.restaurantTypesRepository.create(restaurantType);
  }

  @Span('Delete Restaurant Type')
  async deleteRestaurantType(restaurantTypeId: string): Promise<RestaurantTypeDocument> {
    const ctx = `${RestaurantTypesService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        restaurantTypeId,
      })}`,
    );

    await this.getRestaurantTypeByIdOrThrow(restaurantTypeId);

    const type = restaurantTypeId;
    const isCommercialExists = await this.allCommercialsService.isCommercialExists({
      types: {
        $in: [type],
      },
      category: CommercialCategory.RESTAURANT,
    });

    if (isCommercialExists) {
      throw new ErrorException(CODES.TEC_052);
    }

    this.logger.verbose(`{${ctx}} (removing restaurant type)`);

    return this.restaurantTypesRepository.findByIdAndDelete(restaurantTypeId);
  }
}
