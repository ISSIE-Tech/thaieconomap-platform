import { Injectable, Logger } from '@nestjs/common';

import { ErrorException } from '../../../common/exceptions';
import { CODES } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';
import { prettyObjectString } from '../../../shared/utils';
import { CreateProductTypeDto } from '../dto';
import { ProductTypesRepository } from '../repositories';
import { ProductTypeDocument } from '../schemas';

import { AllPumpuangsService } from './all-pumpuang.service';

@Injectable()
export class ProductTypesService {
  private readonly logger: Logger = new Logger(ProductTypesService.name);

  constructor(
    private readonly productTypesRepository: ProductTypesRepository,
    private readonly allPumpuangsService: AllPumpuangsService,
  ) {}

  async getProductTypes(): Promise<ProductTypeDocument[]> {
    this.logger.debug(`{${ProductTypesService.name}-${this.getProductTypes.name}} (called)`);

    return this.productTypesRepository.find({});
  }

  async createProductType(
    user: IUser,
    createProductTypeDto: CreateProductTypeDto,
  ): Promise<ProductTypeDocument> {
    const ctx = `${ProductTypesService.name}-${this.createProductType.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        createProductTypeDto,
      })}`,
    );

    const productTypeExists = await this.productTypesRepository.findOne({
      name: createProductTypeDto.name,
    });

    if (productTypeExists) {
      throw new ErrorException(CODES.TEC_060);
    }

    const productType = {
      ...createProductTypeDto,
      createdBy: user._id,
    };

    this.logger.verbose(
      `{${ctx}} (create product type) data:\n${prettyObjectString({
        productType,
      })}`,
    );

    return this.productTypesRepository.create(productType);
  }

  async deleteProductType(productTypeId: string): Promise<ProductTypeDocument> {
    const ctx = `${ProductTypesService.name}-${this.deleteProductType.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        productTypeId,
      })}`,
    );

    await this.getProductTypeByIdOrThrow(productTypeId);

    const isPumpuangExists = await this.allPumpuangsService.isPumpuangExists({
      types: { $in: [productTypeId] },
    });

    if (isPumpuangExists) {
      throw new ErrorException(CODES.TEC_070);
    }

    this.logger.verbose(`{${ctx}} (removing product type)`);

    return this.productTypesRepository.findByIdAndDelete(productTypeId);
  }

  async getProductTypeByIdOrThrow(productTypeId: string): Promise<ProductTypeDocument> {
    this.logger.debug(
      `{${ProductTypesService.name}-${this.getProductTypeByIdOrThrow.name}} (called)\
      \n[param] ${prettyObjectString({
        productTypeId,
      })}`,
    );

    const productType = await this.productTypesRepository.findById(productTypeId);

    if (!productType) {
      throw new ErrorException(CODES.TEC_061);
    }

    return productType;
  }

  async checkAllProductTypesExist(types: string[]): Promise<void> {
    const ctx = `${ProductTypesService.name}-${this.checkAllProductTypesExist.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        types,
      })}`,
    );

    const productTypes = await this.productTypesRepository.find(
      {
        _id: { $in: types },
      },
      {
        _id: 1,
      },
    );

    const foundIds = productTypes.map(productType => productType._id.toString());
    const missingIds = types.filter(type => !foundIds.includes(type));

    this.logger.verbose(
      `{${ctx}} (current missing) data:\n${prettyObjectString({
        missingIds,
      })}`,
    );

    if (missingIds.length > 0) {
      // throw new error please don't use CODES.TEC_059
      throw new ErrorException(CODES.TEC_059, undefined, `${CODES.TEC_059.message}: ${missingIds}`);
    }
  }
}
