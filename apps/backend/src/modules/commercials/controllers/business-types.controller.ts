import { Body, Controller, Delete, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
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

import {
  CacheClearKeys,
  CurrentUser,
  GlobalResponseCacheTTL,
  ObjectId,
  ResponseCacheNamespace,
  Roles,
} from '../../../common/decorators';
import { AuthGuard, RolesGuard } from '../../../common/guards';
import { CacheClearInterceptor, ResponseCacheInterceptor } from '../../../common/interceptors';
import { CONFIG } from '../../../config/config';
import { CACHE_KEY, DOC_DESCRIPTION } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';
import { CreateBusinessTypeDto } from '../dto';
import { BusinessType } from '../schemas';
import { BusinessTypesService } from '../services/business-types.service';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('business-types')
@GlobalResponseCacheTTL(CONFIG.LONG_TERM_REPONSE_CACHE_TTL)
@ResponseCacheNamespace(CACHE_KEY.businessTypes.prefix)
export class BusinessTypesController {
  constructor(private readonly businessTypesService: BusinessTypesService) {}

  @ApiOkResponse({ description: 'Return array of business type.' })
  @Get()
  @UseInterceptors(ResponseCacheInterceptor)
  async getBusinessTypes(): Promise<TypeResponseDto[]> {
    return this.businessTypesService.getBusinessTypes() as unknown as Promise<TypeResponseDto[]>;
  }

  @ApiOkResponse({ description: 'Business type created and return.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.businessTypes.all)
  @UseInterceptors(CacheClearInterceptor)
  async createStoreType(
    @CurrentUser() user: IUser,
    @Body() createBusinessTypeDto: CreateBusinessTypeDto,
  ): Promise<TypeResponseDto> {
    return this.businessTypesService.createBusinessType(user, createBusinessTypeDto) as unknown as Promise<TypeResponseDto>;
  }

  @ApiOkResponse({ description: 'Business type deleted' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('businessTypeId') })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(BusinessType.name) })
  @ApiParam({ name: 'businessTypeId' })
  @Delete(':businessTypeId')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.businessTypes.all)
  @UseInterceptors(CacheClearInterceptor)
  async deleteStoreType(
    @ObjectId('businessTypeId') businessTypeId: string,
  ): Promise<TypeResponseDto> {
    return this.businessTypesService.deleteBusinessType(businessTypeId) as unknown as Promise<TypeResponseDto>;
  }
}
