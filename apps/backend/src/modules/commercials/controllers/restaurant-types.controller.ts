import { CacheTTL } from '@nestjs/cache-manager';
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
  ObjectId,
  ResponseCacheNamespace,
  Roles,
} from '../../../common/decorators';
import { AuthGuard, RolesGuard } from '../../../common/guards';
import { CacheClearInterceptor, ResponseCacheInterceptor } from '../../../common/interceptors';
import { CONFIG } from '../../../config';
import { CACHE_KEY, DOC_DESCRIPTION } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';
import { CreateRestaurantTypeDto } from '../dto';
import { RestaurantType } from '../schemas';
import { RestaurantTypesService } from '../services/restaurant-types.service';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Invalid Token.' })
@Controller('restaurant-types')
@CacheTTL(CONFIG.LONG_TERM_REPONSE_CACHE_TTL)
@ResponseCacheNamespace(CACHE_KEY.restaurantTypes.prefix)
export class RestaurantTypesController {
  constructor(private readonly restaurantTypesService: RestaurantTypesService) {}

  @ApiOkResponse({ description: 'Return array of restaurant type.' })
  @Get()
  @UseInterceptors(ResponseCacheInterceptor)
  async getRestaurantTypes(): Promise<TypeResponseDto[]> {
    return this.restaurantTypesService.getRestaurantTypes() as unknown as Promise<TypeResponseDto[]>;
  }

  @ApiOkResponse({ description: 'Restaurant type created and return.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.restaurantTypes.all)
  @UseInterceptors(CacheClearInterceptor)
  async createRestaurantType(
    @CurrentUser() user: IUser,
    @Body() createRestaurantTypeDto: CreateRestaurantTypeDto,
  ): Promise<TypeResponseDto> {
    return this.restaurantTypesService.createRestaurantType(user, createRestaurantTypeDto) as unknown as Promise<TypeResponseDto>;
  }

  @ApiOkResponse({ description: 'Restaurant type deleted.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('restaurantTypeId') })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(RestaurantType.name) })
  @ApiParam({ name: 'restaurantTypeId' })
  @Delete(':restaurantTypeId')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.restaurantTypes.all)
  @UseInterceptors(CacheClearInterceptor)
  async deleteRestaurantType(
    @ObjectId('restaurantTypeId') restaurantTypeId: string,
  ): Promise<TypeResponseDto> {
    return this.restaurantTypesService.deleteRestaurantType(restaurantTypeId) as unknown as Promise<TypeResponseDto>;
  }
}
