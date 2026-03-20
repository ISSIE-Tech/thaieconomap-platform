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
import { IUser } from '../../../shared/interfaces';
import { CreateShareTypeDto } from '../dto';
import { ShareType } from '../schemas';
import { ShareTypesService } from '../services';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('share-types')
@ResponseCacheNamespace(CACHE_KEY.shareTypes.prefix)
@GlobalResponseCacheTTL(CONFIG.LONG_TERM_REPONSE_CACHE_TTL)
export class ShareTypesController {
  constructor(private shareTypesService: ShareTypesService) {}

  @ApiOkResponse({ description: 'Return array of share-types.' })
  @Get()
  @UseInterceptors(ResponseCacheInterceptor)
  async getShareTypes(): Promise<TypeResponseDto[]> {
    return this.shareTypesService.getShareTypes() as unknown as Promise<TypeResponseDto[]>;
  }

  @ApiOkResponse({ description: 'Share-types created and return.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.shareTypes.all)
  @UseInterceptors(CacheClearInterceptor)
  @Post()
  async createShareType(
    @CurrentUser() user: IUser,
    @Body() createShareTypeDto: CreateShareTypeDto,
  ): Promise<TypeResponseDto> {
    return this.shareTypesService.createShareType(user, createShareTypeDto) as unknown as Promise<TypeResponseDto>;
  }

  @ApiOkResponse({ description: 'Share-types deleted.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('shareTypeId') })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(ShareType.name) })
  @ApiParam({ name: 'shareTypeId' })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.shareTypes.all)
  @UseInterceptors(CacheClearInterceptor)
  @Delete(':shareTypeId')
  async deleteJobType(@ObjectId('shareTypeId') shareTypeId: string): Promise<TypeResponseDto> {
    return this.shareTypesService.deleteShareType(shareTypeId) as unknown as Promise<TypeResponseDto>;
  }
}
