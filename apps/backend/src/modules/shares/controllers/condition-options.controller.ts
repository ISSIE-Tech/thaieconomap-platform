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
import { CONFIG } from '../../../config';
import { CACHE_KEY, DOC_DESCRIPTION } from '../../../shared/constants';
import { CreateConditionOptionDto } from '../dto';
import { ConditionOption } from '../schemas';
import { ConditionOptionsService } from '../services';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('condition-options')
@ResponseCacheNamespace(CACHE_KEY.conditionOptions.prefix)
@GlobalResponseCacheTTL(CONFIG.LONG_TERM_REPONSE_CACHE_TTL)
export class ConditionOptionsController {
  constructor(private readonly conditionOptionsService: ConditionOptionsService) {}

  @ApiOkResponse({ description: 'Return array of condition-options.' })
  @Get()
  @UseInterceptors(ResponseCacheInterceptor)
  async getAllConditionOptions(): Promise<TypeResponseDto[]> {
    return this.conditionOptionsService.getAllConditionOptions() as unknown as Promise<TypeResponseDto[]>;
  }

  @ApiOkResponse({ description: 'Condition-options created and return.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.conditionOptions.all)
  @UseInterceptors(CacheClearInterceptor)
  @Post()
  async createConditionOption(
    @CurrentUser('_id') userId: string,
    @Body() createConditionOptionDto: CreateConditionOptionDto,
  ): Promise<TypeResponseDto> {
    return this.conditionOptionsService.createConditionOption(userId, createConditionOptionDto) as unknown as Promise<TypeResponseDto>;
  }

  @ApiOkResponse({ description: 'Condition-options deleted.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('conditionOptionId') })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(ConditionOption.name) })
  @ApiParam({ name: 'conditionOptionId' })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.conditionOptions.all)
  @UseInterceptors(CacheClearInterceptor)
  @Delete(':conditionOptionId')
  async deleteConditionOption(
    @ObjectId('conditionOptionId') conditionOptionId: string,
  ): Promise<TypeResponseDto> {
    return this.conditionOptionsService.deleteConditionOption(conditionOptionId) as unknown as Promise<TypeResponseDto>;
  }
}
