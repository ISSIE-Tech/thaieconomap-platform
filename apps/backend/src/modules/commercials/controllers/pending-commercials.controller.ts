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
  CommercialResponseDto,
  PaginationResponseDto,
  PendingCommercialResponseDto,
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
import { CACHE_KEY, COMMERCIAL_FILE_POLICY, DOC_DESCRIPTION } from '../../../shared/constants';
import { SubmissionMessageDto } from '../../../shared/dto';
import { IUser } from '../../../shared/interfaces';
import { buildMultiLineDocDescription } from '../../../shared/utils';
import {
  CreatePendingCommercialDto,
  GetPendingCommercialsQueryDto,
  UpdatePendingCommercialDto,
  UpdateRejectedPendingCommercialDto,
} from '../dto';
import { CommercialMapper } from '../mappers';
import { PendingCommercial } from '../schemas';
import { PendingCommercialsService } from '../services/pending-commercials.service';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('pending-commercials')
@CacheTTL(CONFIG.RESPONSE_CACHE_TTL)
@ResponseCacheNamespace(CACHE_KEY.pendingCommercials.prefix)
@UseGuards(AuthGuard)
export class PendingCommercialsController {
  constructor(private readonly pendingCommercialsService: PendingCommercialsService) {}

  @ApiOkResponse({ description: 'Pagination results of pending commercial' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetPendingCommercialsQueryDto.name),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @Get()
  @UseInterceptors(TransformFileInterceptor)
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  async getPendingCommercials(
    @CurrentUser() user: IUser,
    @Query() getPendingCommercialsQueryDto: GetPendingCommercialsQueryDto,
  ): Promise<PaginationResponseDto<PendingCommercialResponseDto>> {
    const result = await this.pendingCommercialsService.getPendingCommercials(
      user,
      getPendingCommercialsQueryDto,
    );

    return CommercialMapper.toPaginatedResponseDto(result, CommercialMapper.toPendingResponseDto);
  }

  @ApiOkResponse({ description: 'Return pending commercial.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('pendingCommercialId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingCommercial.name) })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN, UserRole.MANAGER, 'OWNER'),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiParam({ name: 'pendingCommercialId' })
  @Get(':pendingCommercialId')
  @UseInterceptors(TransformFileInterceptor)
  async getPendingCommercialById(
    @CurrentUser() user: IUser,
    @ObjectId('pendingCommercialId') pendingCommercialId: string,
  ): Promise<PendingCommercialResponseDto> {
    const result = await this.pendingCommercialsService.getPrivatePendingCommercialById(
      user,
      pendingCommercialId,
    );

    return CommercialMapper.toPendingResponseDto(result);
  }

  @ApiOkResponse({ description: 'Delete pending commercial and its images.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('pendingCommercialId') })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN, UserRole.MANAGER, 'OWNER'),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiParam({ name: 'pendingCommercialId' })
  @Delete(':pendingCommercialId')
  @CacheClearKeys(CACHE_KEY.pendingCommercials.all, CACHE_KEY.allCommercials.all)
  @UseInterceptors(CacheClearInterceptor)
  async deletePendingCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('pendingCommercialId') pendingCommercialId: string,
  ): Promise<void> {
    await this.pendingCommercialsService.deletePendingCommercial(user, pendingCommercialId);
  }

  @ApiCreatedResponse({ description: 'Pending commercial created and return.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INVALID_REQ_BODY(CreatePendingCommercialDto.name),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.INVALID_FILE_POLICY(COMMERCIAL_FILE_POLICY),
      DOC_DESCRIPTION.TEC_049,
      DOC_DESCRIPTION.TEC_050,
      DOC_DESCRIPTION.TEC_051,
    ),
  })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Post()
  @CacheClearKeys(CACHE_KEY.pendingCommercials.all, CACHE_KEY.allCommercials.all)
  @UseInterceptors(CacheClearInterceptor, FileInterceptor('image'), TransformFileInterceptor)
  async createPendingCommercial(
    @CurrentUser() user: IUser,
    @Body() createPendingCommercialDto: CreatePendingCommercialDto,
    @UploadedFile(
      new FileValidationPipe(COMMERCIAL_FILE_POLICY.type, COMMERCIAL_FILE_POLICY.maxSize, true),
    )
    image: Express.Multer.File,
  ): Promise<PendingCommercialResponseDto> {
    const result = await this.pendingCommercialsService.createPendingCommercial(
      user,
      createPendingCommercialDto,
      image,
    );

    return CommercialMapper.toPendingResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Successfully upload additional image.' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_FILE_POLICY(COMMERCIAL_FILE_POLICY),
  })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Post('upload-additional-image')
  @UseGuards(ProxiedThrottlerGuard)
  @Throttle({ default: { limit: 60, ttl: minutes(15) } })
  @UseInterceptors(FilesInterceptor('image', CONFIG.MAX_UPLOADING_ADDITIONAL_IMAGE))
  async uploadAddtionalImage(
    @CurrentUser() user: IUser,
    @UploadedFiles(
      new FileValidationPipe(COMMERCIAL_FILE_POLICY.type, COMMERCIAL_FILE_POLICY.maxSize),
    )
    images: Array<Express.Multer.File>,
  ): Promise<string[]> {
    return this.pendingCommercialsService.uploadAdditionalImage(user, images);
  }

  @ApiOkResponse({ description: 'Additional image deleted and return pending commercial.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('commercialId'),
      DOC_DESCRIPTION.TEC_048(PendingCommercial.name),
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingCommercial.name) })
  @ApiParam({ name: 'pendingCommercialId' })
  @Delete(':pendingCommercialId/delete-additional-image')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @CacheClearKeys(CACHE_KEY.pendingCommercials.all, CACHE_KEY.allCommercials.all)
  @UseInterceptors(CacheClearInterceptor)
  async deleteAdditionalImage(
    @CurrentUser() user: IUser,
    @ObjectId('pendingCommercialId') pendingCommercialId: string,
    @Query('fileName') fileName: string,
  ): Promise<PendingCommercialResponseDto> {
    const result = await this.pendingCommercialsService.deleteAdditionalImageUrl(
      user,
      pendingCommercialId,
      fileName,
    );

    return CommercialMapper.toPendingResponseDto(result);
  }

  @ApiOkResponse({ description: 'Pending commercial updated and return' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingCommercialId'),
      DOC_DESCRIPTION.INVALID_REQ_BODY(CreatePendingCommercialDto.name),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.INVALID_FILE_POLICY(COMMERCIAL_FILE_POLICY),
      DOC_DESCRIPTION.TEC_049,
      DOC_DESCRIPTION.TEC_050,
      DOC_DESCRIPTION.TEC_051,
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingCommercial.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'pendingCommercialId' })
  @Put(':pendingCommercialId')
  @UseGuards(RolesGuard)
  @ExcludeRoles(UserRole.CUSTOMER)
  @CacheClearKeys(CACHE_KEY.pendingCommercials.all, CACHE_KEY.allCommercials.all)
  @UseInterceptors(CacheClearInterceptor, FileInterceptor('image'), TransformFileInterceptor)
  async updatePendingCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('pendingCommercialId') pendingCommercialId: string,
    @Body() updatePendingCommercialDto: UpdatePendingCommercialDto,
    @UploadedFile(
      new FileValidationPipe(COMMERCIAL_FILE_POLICY.type, COMMERCIAL_FILE_POLICY.maxSize, false),
    )
    image: Express.Multer.File,
  ): Promise<PendingCommercialResponseDto> {
    const result = await this.pendingCommercialsService.updatePendingCommercial(
      user,
      pendingCommercialId,
      updatePendingCommercialDto,
      image,
    );

    return CommercialMapper.toPendingResponseDto(result);
  }

  @ApiOkResponse({ description: 'Rejected pending commercial updated and return' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingCommercialId'),
      DOC_DESCRIPTION.INVALID_REQ_BODY(CreatePendingCommercialDto.name),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.INVALID_FILE_POLICY(COMMERCIAL_FILE_POLICY),
      DOC_DESCRIPTION.TEC_049,
      DOC_DESCRIPTION.TEC_050,
      DOC_DESCRIPTION.TEC_051,
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN, UserRole.MANAGER, 'OWNER'),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingCommercial.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'pendingCommercialId' })
  @Put(':pendingCommercialId/edit')
  @CacheClearKeys(CACHE_KEY.pendingCommercials.all, CACHE_KEY.allCommercials.all)
  @UseInterceptors(CacheClearInterceptor, FileInterceptor('image'), TransformFileInterceptor)
  async updateRejectedPendingCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('pendingCommercialId') pendingCommercialId: string,
    @Body() updateRejectedPendingCommercialDto: UpdateRejectedPendingCommercialDto,
    @UploadedFile(
      new FileValidationPipe(COMMERCIAL_FILE_POLICY.type, COMMERCIAL_FILE_POLICY.maxSize, false),
    )
    image: Express.Multer.File,
  ): Promise<PendingCommercialResponseDto> {
    const result = await this.pendingCommercialsService.updateRejectedPendingCommercial(
      user,
      pendingCommercialId,
      updateRejectedPendingCommercialDto,
      image,
    );

    return CommercialMapper.toPendingResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Approve pending commercial and return.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingCommercialId'),
      DOC_DESCRIPTION.HAS_BEEN_REJECTED,
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingCommercial.name) })
  @ApiParam({ name: 'pendingCommercialId' })
  @Post(':pendingCommercialId/approve')
  @UseGuards(RolesGuard)
  @ExcludeRoles(UserRole.CUSTOMER)
  @CacheClearKeys(
    CACHE_KEY.commercials.all,
    CACHE_KEY.pendingCommercials.all,
    CACHE_KEY.allCommercials.all,
  )
  @UseInterceptors(CacheClearInterceptor, TransformFileInterceptor)
  async approvePendingCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('pendingCommercialId') pendingCommercialId: string,
  ): Promise<CommercialResponseDto> {
    const result = await this.pendingCommercialsService.approvePendingCommercial(
      user,
      pendingCommercialId,
    );

    return CommercialMapper.toResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Reject pending commercial and set auto delete.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingCommercialId'),
      DOC_DESCRIPTION.HAS_BEEN_REJECTED,
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingCommercial.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'pendingCommercialId' })
  @Post(':pendingCommercialId/reject')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @CacheClearKeys(CACHE_KEY.pendingCommercials.all, CACHE_KEY.allCommercials.all)
  @UseInterceptors(CacheClearInterceptor)
  async rejectPendingCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('pendingCommercialId') pendingCommercialId: string,
    @Body() { submissionMessage }: SubmissionMessageDto,
  ): Promise<void> {
    return this.pendingCommercialsService.rejectPendingCommercial(
      user,
      pendingCommercialId,
      submissionMessage,
    );
  }

  @ApiCreatedResponse({ description: 'Restore the rejected pending commercial.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingCommercialId'),
      DOC_DESCRIPTION.UNDER_REVIEW,
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingCommercial.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'pendingCommercialId' })
  @Post(':pendingCommercialId/restore')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @CacheClearKeys(CACHE_KEY.pendingCommercials.all, CACHE_KEY.allCommercials.all)
  @UseInterceptors(CacheClearInterceptor, TransformFileInterceptor)
  async restoreRejectedPendingCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('pendingCommercialId') pendingCommercialId: string,
  ): Promise<PendingCommercialResponseDto> {
    const result = await this.pendingCommercialsService.restoreRejectedPendingCommercial(
      user,
      pendingCommercialId,
    );

    return CommercialMapper.toPendingResponseDto(result);
  }
}
