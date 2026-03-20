import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { TypeResponseDto, UserRole } from '@thaieconomap/contracts';

import { CurrentUser, ObjectId, Roles } from '../../../common/decorators';
import { AuthGuard, RolesGuard } from '../../../common/guards';
import { DOC_DESCRIPTION } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';
import { CreateProductTypeDto } from '../dto';
import { ProductType } from '../schemas';
import { ProductTypesService } from '../services';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Get()
  async getProductTypes(): Promise<TypeResponseDto[]> {
    return this.productTypesService.getProductTypes() as unknown as Promise<TypeResponseDto[]>;
  }

  @ApiOkResponse({ description: 'ProductType created and return.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async createProductType(
    @CurrentUser() user: IUser,
    @Body() createProductTypeDto: CreateProductTypeDto,
  ): Promise<TypeResponseDto> {
    return this.productTypesService.createProductType(user, createProductTypeDto) as unknown as Promise<TypeResponseDto>;
  }

  @ApiOkResponse({ description: 'Restaurant type deleted.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('productTypeId') })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(ProductType.name) })
  @ApiParam({ name: 'productTypeId' })
  @Delete(':productTypeId')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteProductType(
    @ObjectId('productTypeId') productTypeId: string,
  ): Promise<TypeResponseDto> {
    return this.productTypesService.deleteProductType(productTypeId) as unknown as Promise<TypeResponseDto>;
  }
}
