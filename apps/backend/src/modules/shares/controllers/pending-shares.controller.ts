import { CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle, minutes } from '@nestjs/throttler';

import {
  PaginationResponseDto,
  PendingShareResponseDto,
  ShareResponseDto,
  UserRole,
} from '@thaieconomap/contracts';
import { Express } from 'express';

import {
  CacheClearKeys,
  CurrentUser,
  ExcludeRoles,
  ObjectId,
  ResponseCacheNamespace,
} from '../../../common/decorators';
import { AuthGuard, ProxiedThrottlerGuard, RolesGuard } from '../../../common/guards';
import { CacheClearInterceptor, TransformFileInterceptor } from '../../../common/interceptors';
import { FileValidationPipe } from '../../../common/pipes';
import { CONFIG } from '../../../config';
import { CACHE_KEY, DOC_DESCRIPTION, SHARES_FILE_POLICY } from '../../../shared/constants';
import { SubmissionMessageDto } from '../../../shared/dto';
import { IUser } from '../../../shared/interfaces';
import { buildMultiLineDocDescription } from '../../../shared/utils';
import {
  CreatePendingShareDto,
  GetPendingSharesQueryDto,
  UpdatePendingShareDto,
  UpdateRejectedPendingShareDto,
} from '../dto';
import { ShareMapper } from '../mappers';
import { PendingShare, PendingShareDocument, Share } from '../schemas';
import { PendingSharesService } from '../services';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@CacheTTL(CONFIG.RESPONSE_CACHE_TTL)
@ResponseCacheNamespace(CACHE_KEY.pendingShares.prefix)
@Controller('pending-shares')
@UseGuards(AuthGuard)
export class PendingSharesController {
  constructor(private pendingSharesService: PendingSharesService) {}

  @ApiOkResponse({ description: 'Pagination results of pending shares' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetPendingSharesQueryDto.name),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @Get()
  @UseInterceptors(TransformFileInterceptor)
  async getPaginatedPendingShares(
    @CurrentUser() user: IUser,
    @Query() getPendingSharesQueryDto: GetPendingSharesQueryDto,
  ): Promise<PaginationResponseDto<PendingShareResponseDto>> {
    const result = await this.pendingSharesService.getPaginatedPendingShares(user, getPendingSharesQueryDto);

    return ShareMapper.toPaginatedResponseDto(result, ShareMapper.toPendingResponseDto);
  }

  @ApiOkResponse({ description: 'Return pending share.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('pendingShareId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingShare.name) })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN, UserRole.MANAGER, 'OWNER'),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiParam({ name: 'pendingShareId' })
  @Get(':pendingShareId')
  @UseInterceptors(TransformFileInterceptor)
  async getPendingShareById(
    @CurrentUser() user: IUser,
    @ObjectId('pendingShareId') pendingShareId: string,
  ): Promise<PendingShareResponseDto> {
    const result = await this.pendingSharesService.getPrivatePendingShareById(user, pendingShareId);

    return ShareMapper.toPendingResponseDto(result as PendingShareDocument);
  }

  @ApiCreatedResponse({ description: 'Pending share created and return.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INVALID_REQ_BODY(CreatePendingShareDto.name),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.INVALID_FILE_POLICY(SHARES_FILE_POLICY),
      DOC_DESCRIPTION.TEC_040,
      DOC_DESCRIPTION.TEC_049,
      DOC_DESCRIPTION.TEC_050,
    ),
  })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Post()
  @CacheClearKeys(CACHE_KEY.pendingShares.all, CACHE_KEY.allShares.all)
  @UseInterceptors(CacheClearInterceptor, FileInterceptor('image'), TransformFileInterceptor)
  async createPendingShare(
    @CurrentUser() user: IUser,
    @Body() createPendingShareDto: CreatePendingShareDto,
    @UploadedFile(new FileValidationPipe(SHARES_FILE_POLICY.type, SHARES_FILE_POLICY.maxSize))
    image: Express.Multer.File,
  ): Promise<PendingShareResponseDto> {
    const result = await this.pendingSharesService.createPendingShare(user, createPendingShareDto, image);

    return ShareMapper.toPendingResponseDto(result as PendingShareDocument);
  }

  @ApiOkResponse({ description: 'Pending share updated and return' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingShareId'),
      DOC_DESCRIPTION.INVALID_REQ_BODY(UpdatePendingShareDto.name),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.INVALID_FILE_POLICY(SHARES_FILE_POLICY),
      DOC_DESCRIPTION.TEC_040,
      DOC_DESCRIPTION.TEC_049,
      DOC_DESCRIPTION.TEC_050,
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingShare.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'pendingShareId' })
  @Put(':pendingShareId')
  @UseGuards(RolesGuard)
  @ExcludeRoles(UserRole.CUSTOMER)
  @CacheClearKeys(CACHE_KEY.pendingShares.all, CACHE_KEY.allShares.all)
  @UseInterceptors(CacheClearInterceptor, FileInterceptor('image'), TransformFileInterceptor)
  async updatePendingShare(
    @CurrentUser() user: IUser,
    @ObjectId('pendingShareId') pendingShareId: string,
    @Body() updatePendingShareDto: UpdatePendingShareDto,
    @UploadedFile(
      new FileValidationPipe(SHARES_FILE_POLICY.type, SHARES_FILE_POLICY.maxSize, false),
    )
    image: Express.Multer.File,
  ): Promise<PendingShareResponseDto> {
    const result = await this.pendingSharesService.updatePendingShare(
      user,
      pendingShareId,
      updatePendingShareDto,
      image,
    );

    return ShareMapper.toPendingResponseDto(result as PendingShareDocument);
  }

  @ApiOkResponse({ description: 'Rejected pending share updated and return' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingShareId'),
      DOC_DESCRIPTION.UNDER_REVIEW,
      DOC_DESCRIPTION.INVALID_REQ_BODY(UpdateRejectedPendingShareDto.name),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.INVALID_FILE_POLICY(SHARES_FILE_POLICY),
      DOC_DESCRIPTION.TEC_040,
      DOC_DESCRIPTION.TEC_049,
      DOC_DESCRIPTION.TEC_050,
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN, UserRole.MANAGER, 'OWNER'),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingShare.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'pendingShareId' })
  @Put(':pendingShareId/edit')
  @CacheClearKeys(CACHE_KEY.pendingShares.all, CACHE_KEY.allShares.all)
  @UseInterceptors(CacheClearInterceptor, FileInterceptor('image'), TransformFileInterceptor)
  async updateRejectedPendingShare(
    @CurrentUser() user: IUser,
    @ObjectId('pendingShareId') pendingShareId: string,
    @Body() updateRejectedPendingShareDto: UpdateRejectedPendingShareDto,
    @UploadedFile(
      new FileValidationPipe(SHARES_FILE_POLICY.type, SHARES_FILE_POLICY.maxSize, false),
    )
    image: Express.Multer.File,
  ): Promise<PendingShareResponseDto> {
    const result = await this.pendingSharesService.updateRejectedPendingShare(
      user,
      pendingShareId,
      updateRejectedPendingShareDto,
      image,
    );

    return ShareMapper.toPendingResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Approve pending share and return.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingShareId'),
      DOC_DESCRIPTION.HAS_BEEN_REJECTED,
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingShare.name) })
  @ApiParam({ name: 'pendingShareId' })
  @Post(':pendingShareId/approve')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @CacheClearKeys(CACHE_KEY.shares.all, CACHE_KEY.pendingShares.all, CACHE_KEY.allShares.all)
  @UseInterceptors(CacheClearInterceptor, TransformFileInterceptor)
  async approvePendingShare(
    @CurrentUser() user: IUser,
    @ObjectId('pendingShareId') pendingShareId: string,
  ): Promise<ShareResponseDto> {
    const result = await this.pendingSharesService.approvePendingShare(user, pendingShareId);

    return ShareMapper.toResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Reject pending share and set auto delete.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INVALID_REQ_BODY(SubmissionMessageDto.name),
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingShareId'),
      DOC_DESCRIPTION.HAS_BEEN_REJECTED,
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingShare.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'pendingShareId' })
  @Post(':pendingShareId/reject')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @CacheClearKeys(CACHE_KEY.pendingShares.all, CACHE_KEY.allShares.all)
  @UseInterceptors(CacheClearInterceptor)
  async rejectPendingShare(
    @CurrentUser() user: IUser,
    @ObjectId('pendingShareId') pendingShareId: string,
    @Body() { submissionMessage }: SubmissionMessageDto,
  ): Promise<void> {
    return this.pendingSharesService.rejectPendingShare(user, pendingShareId, submissionMessage);
  }

  @ApiCreatedResponse({ description: 'Successfully upload additional image.' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_FILE_POLICY(SHARES_FILE_POLICY),
  })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Post('upload-additional-image')
  @UseInterceptors(FilesInterceptor('image', CONFIG.MAX_UPLOADING_ADDITIONAL_IMAGE))
  @UseGuards(ProxiedThrottlerGuard)
  @Throttle({ default: { limit: 60, ttl: minutes(15) } })
  async uploadAddtionalImage(
    @CurrentUser() user: IUser,
    @UploadedFiles(
      new FileValidationPipe(SHARES_FILE_POLICY.type, SHARES_FILE_POLICY.maxSize, true),
    )
    images: Array<Express.Multer.File>,
  ): Promise<string[]> {
    return this.pendingSharesService.uploadAdditionalImage(user, images);
  }

  @ApiOkResponse({ description: 'Additional image deleted and return pending share.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingShareId'),
      DOC_DESCRIPTION.TEC_048(Share.name),
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingShare.name) })
  @ApiParam({ name: 'pendingShareId' })
  @Delete(':pendingShareId/delete-additional-image')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  async deleteAdditionalImage(
    @ObjectId('pendingShareId') pendingShareId: string,
    @Query('fileName') fileName: string,
  ): Promise<PendingShareResponseDto> {
    const result = await this.pendingSharesService.deleteAdditionalImageUrl(pendingShareId, fileName);

    return ShareMapper.toPendingResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Restore the rejected pending share.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingShareId'),
      DOC_DESCRIPTION.UNDER_REVIEW,
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingShare.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'pendingShareId' })
  @Post(':pendingShareId/restore')
  @ExcludeRoles(UserRole.CUSTOMER)
  @CacheClearKeys(CACHE_KEY.pendingShares.all, CACHE_KEY.allShares.all)
  @UseInterceptors(CacheClearInterceptor, TransformFileInterceptor)
  @UseGuards(RolesGuard)
  async restoreRejectedPendingShare(
    @CurrentUser() user: IUser,
    @ObjectId('pendingShareId') pendingShareId: string,
  ): Promise<PendingShareResponseDto> {
    const result = await this.pendingSharesService.restoreRejectedPendingShare(user, pendingShareId);

    return ShareMapper.toPendingResponseDto(result);
  }
}
