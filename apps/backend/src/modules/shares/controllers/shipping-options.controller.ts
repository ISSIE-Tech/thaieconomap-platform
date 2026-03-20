import { Body, Controller, Delete, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
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
import { CONFIG } from '../../../config';
import { CACHE_KEY, DOC_DESCRIPTION } from '../../../shared/constants';
import { UserDocument } from '../../users/schemas';
import { CreateShippingOptionDto } from '../dto';
import { ShippingOption } from '../schemas';
import { ShippingOptionsService } from '../services';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('shipping-options')
@ResponseCacheNamespace(CACHE_KEY.shippingOptions.prefix)
@GlobalResponseCacheTTL(CONFIG.LONG_TERM_REPONSE_CACHE_TTL)
export class ShippingOptionsController {
  constructor(private readonly shippingOptionsService: ShippingOptionsService) {}

  @ApiOkResponse({ description: 'Return array of shipping-options.' })
  @Get()
  @UseInterceptors(ResponseCacheInterceptor)
  async getShippingOptions(): Promise<TypeResponseDto[]> {
    return this.shippingOptionsService.getShippingOptions() as unknown as Promise<TypeResponseDto[]>;
  }

  @ApiOkResponse({ description: 'Shipping-options created and return.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.shippingOptions.all)
  @UseInterceptors(CacheClearInterceptor)
  @Post()
  async createShippingOption(
    @CurrentUser() user: UserDocument,
    @Body() createShippingOptionDto: CreateShippingOptionDto,
  ): Promise<TypeResponseDto> {
    return this.shippingOptionsService.createShippingOption(user, createShippingOptionDto) as unknown as Promise<TypeResponseDto>;
  }

  @ApiOkResponse({ description: 'Shipping-options deleted.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('shippingOptionId') })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(ShippingOption.name) })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.shippingOptions.all)
  @UseInterceptors(CacheClearInterceptor)
  @Delete(':shippingOptionId')
  async deleteShippingOption(
    @ObjectId('shippingOptionId') shippingOptionId: string,
  ): Promise<TypeResponseDto> {
    return this.shippingOptionsService.deleteShippingOption(shippingOptionId) as unknown as Promise<TypeResponseDto>;
  }
}
