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
  DeletedPumpuangResponseDto,
  PaginationResponseDto,
  PumpuangResponseDto,
  UserRole,
} from '@thaieconomap/contracts';

import { CurrentUser, ExcludeRoles, ObjectId } from '../../../common/decorators';
import { AuthGuard, RolesGuard } from '../../../common/guards';
import { TransformFileInterceptor } from '../../../common/interceptors';
import { DOC_DESCRIPTION } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';
import { buildMultiLineDocDescription } from '../../../shared/utils';
import { GetDeletedPumpuangsQueryDto } from '../dto';
import { PumpuangMapper } from '../mappers';
import { DeletedPumpuang } from '../schemas';
import { DeletedPumpuangsService } from '../services';

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
@Controller('deleted-pumpuangs')
export class DeletedPumpuangsController {
  constructor(private readonly deletedPumpuangsService: DeletedPumpuangsService) {}

  @ApiOkResponse({ description: 'Pagination results of deleted pumpuangs' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetDeletedPumpuangsQueryDto.name),
  })
  @Get()
  @UseInterceptors(TransformFileInterceptor)
  async getDeletedPumpuangs(
    @CurrentUser() user: IUser,
    @Query() getDeletedPumpuangsQueryDto: GetDeletedPumpuangsQueryDto,
  ): Promise<PaginationResponseDto<DeletedPumpuangResponseDto>> {
    const result = await this.deletedPumpuangsService.getDeletedPumpuangs(user, getDeletedPumpuangsQueryDto);

    return PumpuangMapper.toPaginatedResponseDto(result, PumpuangMapper.toDeletedResponseDto);
  }

  @ApiOkResponse({ description: 'Return deleted Pumpuangs.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('deletedPumpuangId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(DeletedPumpuang.name) })
  @ApiParam({ name: 'deletedPumpuangId' })
  @Get(':deletedPumpuangId')
  @UseInterceptors(TransformFileInterceptor)
  async getDeletedPumpuangById(
    @CurrentUser() user: IUser,
    @ObjectId('deletedPumpuangId') deletedPumpuangId: string,
  ): Promise<DeletedPumpuangResponseDto> {
    const result = await this.deletedPumpuangsService.getDeletedPumpuangById(user, deletedPumpuangId);

    return PumpuangMapper.toDeletedResponseDto(result);
  }

  @ApiOkResponse({ description: 'Remove deleted pumpuang from DB.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('deletedPumpuangId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(DeletedPumpuang.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'deletedPumpuangId' })
  @Delete(':deletedPumpuangId')
  async deleteDeletedPumpuangById(
    @CurrentUser() user: IUser,
    @ObjectId('deletedPumpuangId') deletedPumpuangId: string,
  ): Promise<DeletedPumpuangResponseDto> {
    const result = await this.deletedPumpuangsService.deleteDeletedPumpuangById(user, deletedPumpuangId);

    return PumpuangMapper.toDeletedResponseDto(result);
  }

  @ApiOkResponse({ description: 'Restore deleted pumpuang to pumpuang.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('deletedPumpuangId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(DeletedPumpuang.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'deletedPumpuangId' })
  @Post(':deletedPumpuangId/restore')
  @UseInterceptors(TransformFileInterceptor)
  async restoreDeletedPumpuangById(
    @CurrentUser() user: IUser,
    @ObjectId('deletedPumpuangId') deletedPumpuangId: string,
  ): Promise<PumpuangResponseDto> {
    const result = await this.deletedPumpuangsService.restoreDeletedPumpuang(user, deletedPumpuangId);

    return PumpuangMapper.toResponseDto(result);
  }
}
