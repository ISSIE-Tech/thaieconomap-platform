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
  CommercialResponseDto,
  DeletedCommercialResponseDto,
  PaginationResponseDto,
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
import { GetDeletedCommercialsQueryDto } from '../dto';
import { CommercialMapper } from '../mappers';
import { DeletedCommercial } from '../schemas';
import { DeletedCommercialsService } from '../services/deleted-commercials.service';

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
@Controller('deleted-commercials')
@GlobalResponseCacheTTL(CONFIG.RESPONSE_CACHE_TTL)
@ResponseCacheNamespace(CACHE_KEY.deletedCommercials.prefix)
export class DeletedCommercialsController {
  constructor(private readonly deletedCommercialsService: DeletedCommercialsService) {}

  @ApiOkResponse({ description: 'Pagination results of deleted commercial' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetDeletedCommercialsQueryDto.name),
  })
  @Get()
  @UseInterceptors(TransformFileInterceptor)
  async getDeletedCommercials(
    @CurrentUser() user: IUser,
    @Query() getDeletedCommercialsQueryDto: GetDeletedCommercialsQueryDto,
  ): Promise<PaginationResponseDto<DeletedCommercialResponseDto>> {
    const result = await this.deletedCommercialsService.getDeletedCommercials(
      user,
      getDeletedCommercialsQueryDto,
    );

    return CommercialMapper.toPaginatedResponseDto(result, CommercialMapper.toDeletedResponseDto);
  }

  @ApiOkResponse({ description: 'Return deleted commercial.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('deletedCommercialId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(DeletedCommercial.name) })
  @ApiParam({ name: 'deletedCommercialId' })
  @Get(':deletedCommercialId')
  @UseInterceptors(TransformFileInterceptor)
  async getDeletedCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('deletedCommercialId') deletedCommercialId: string,
  ): Promise<DeletedCommercialResponseDto> {
    const result = await this.deletedCommercialsService.getDeletedCommercialById(user, deletedCommercialId);

    return CommercialMapper.toDeletedResponseDto(result);
  }

  @ApiOkResponse({ description: 'Restore deleted commercial to commercial.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('deletedCommercialId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(DeletedCommercial.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'deletedCommercialId' })
  @Post(':deletedCommercialId/restore')
  @CacheClearKeys(
    CACHE_KEY.deletedCommercials.all,
    CACHE_KEY.commercials.all,
    CACHE_KEY.allCommercials.all,
  )
  @UseInterceptors(CacheClearInterceptor, TransformFileInterceptor)
  async restoreDeletedCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('deletedCommercialId') deletedCommercialId: string,
  ): Promise<CommercialResponseDto> {
    const result = await this.deletedCommercialsService.restoreDeletedCommercial(user, deletedCommercialId);

    return CommercialMapper.toResponseDto(result);
  }

  @ApiOkResponse({ description: 'Remove deleted commercial from DB.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('deletedCommercialId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(DeletedCommercial.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'deletedCommercialId' })
  @Delete(':deletedCommercialId')
  @CacheClearKeys(CACHE_KEY.deletedCommercials.all, CACHE_KEY.allCommercials.all)
  @UseInterceptors(CacheClearInterceptor)
  async deleteDeletedCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('deletedCommercialId') deletedCommercialId: string,
  ): Promise<DeletedCommercialResponseDto> {
    const result = await this.deletedCommercialsService.deleteDeletedCommercial(user, deletedCommercialId);

    return CommercialMapper.toDeletedResponseDto(result);
  }
}
