import { Controller, Delete, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  DeletedShareResponseDto,
  PaginationResponseDto,
  ShareResponseDto,
  UserRole,
} from '@thaieconomap/contracts';

import {
  CacheClearKeys,
  CurrentUser,
  ExcludeRoles,
  GlobalResponseCacheTTL,
  ObjectId,
  ResponseCacheNamespace,
} from '../../../common/decorators';
import { AuthGuard, RolesGuard } from '../../../common/guards';
import { CacheClearInterceptor, TransformFileInterceptor } from '../../../common/interceptors';
import { CONFIG } from '../../../config';
import { CACHE_KEY, DOC_DESCRIPTION } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';
import { buildMultiLineDocDescription } from '../../../shared/utils';
import { GetDeletedSharesQueryDto } from '../dto';
import { ShareMapper } from '../mappers';
import { DeletedShare } from '../schemas';
import { DeletedSharesService } from '../services';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@ApiForbiddenResponse({
  description: buildMultiLineDocDescription(
    DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
    DOC_DESCRIPTION.TEC_008,
  ),
})
@ExcludeRoles(UserRole.CUSTOMER)
@UseGuards(AuthGuard, RolesGuard)
@GlobalResponseCacheTTL(CONFIG.RESPONSE_CACHE_TTL)
@ResponseCacheNamespace(CACHE_KEY.deletedShares.prefix)
@Controller('deleted-shares')
export class DeletedSharesController {
  constructor(private readonly deletedSharesService: DeletedSharesService) {}

  @ApiOkResponse({ description: 'Pagination results of deleted shares' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetDeletedSharesQueryDto.name),
  })
  @Get()
  @UseInterceptors(TransformFileInterceptor)
  async getPaginatedDeletedShares(
    @CurrentUser() user: IUser,
    @Query() getDeletedSharesQueryDto: GetDeletedSharesQueryDto,
  ): Promise<PaginationResponseDto<DeletedShareResponseDto>> {
    const result = await this.deletedSharesService.getPaginatedDeletedShares(user, getDeletedSharesQueryDto);

    return ShareMapper.toPaginatedResponseDto(result, ShareMapper.toDeletedResponseDto);
  }

  @ApiOkResponse({ description: 'Return deleted shares.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('deletedShareId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(DeletedShare.name) })
  @ApiParam({ name: 'deletedShareId' })
  @Get(':deletedShareId')
  @UseInterceptors(TransformFileInterceptor)
  async getDeletedShare(
    @ObjectId('deletedShareId') deletedShareId: string,
  ): Promise<DeletedShareResponseDto> {
    const result = await this.deletedSharesService.getDeletedShareById(deletedShareId);

    return ShareMapper.toDeletedResponseDto(result);
  }

  @ApiOkResponse({ description: 'Restore deleted share to share.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('deletedShareId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(DeletedShare.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'deletedShareId' })
  @Post(':deletedShareId/restore')
  @CacheClearKeys(CACHE_KEY.deletedShares.all, CACHE_KEY.shares.all, CACHE_KEY.allShares.all)
  @UseInterceptors(CacheClearInterceptor, TransformFileInterceptor)
  async restoreDeletedShare(
    @CurrentUser() user: IUser,
    @ObjectId('deletedShareId') deletedShareId: string,
  ): Promise<ShareResponseDto> {
    const result = await this.deletedSharesService.restoreDeletedShare(user, deletedShareId);

    return ShareMapper.toResponseDto(result);
  }

  @ApiOkResponse({ description: 'Remove deleted share from DB.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('deletedShareId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(DeletedShare.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'deletedShareId' })
  @Delete(':deletedShareId')
  @CacheClearKeys(CACHE_KEY.deletedShares.all, CACHE_KEY.allShares.all)
  @UseInterceptors(CacheClearInterceptor)
  async deleteDeletedShare(
    @CurrentUser() user: IUser,
    @ObjectId('deletedShareId') deletedShareId: string,
  ): Promise<DeletedShareResponseDto> {
    const result = await this.deletedSharesService.deleteDeletedShare(user, deletedShareId);

    return ShareMapper.toDeletedResponseDto(result);
  }
}
