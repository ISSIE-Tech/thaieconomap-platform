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
  PendingPumpuangResponseDto,
  PumpuangResponseDto,
  RequestSessionResponseDto,
  UserRole,
} from '@thaieconomap/contracts';
import { Express } from 'express';

import { CurrentSession, CurrentUser, ExcludeRoles, ObjectId } from '../../../common/decorators';
import {
  AuthGuard,
  PendingPumpuangSessionGuard,
  ProxiedThrottlerGuard,
  RolesGuard,
} from '../../../common/guards';
import { TransformFileInterceptor } from '../../../common/interceptors';
import { FileValidationPipe } from '../../../common/pipes';
import { CONFIG } from '../../../config';
import { DOC_DESCRIPTION, PUMPUANG_FILE_POLICY } from '../../../shared/constants';
import { SubmissionMessageDto } from '../../../shared/dto';
import { IUser } from '../../../shared/interfaces';
import { buildMultiLineDocDescription } from '../../../shared/utils';
import {
  CreatePendingPumpuangDto,
  GetPendingPumpuangQueryDto,
  RequestSessionDto,
  UpdatePendingPumpuangDto,
} from '../dto';
import { PumpuangMapper } from '../mappers';
import { PendingPumpuang } from '../schemas';
import { PendingPumpuangsService } from '../services';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('pending-pumpuangs')
export class PendingPumpuangsController {
  constructor(private readonly pendingPumpuangsService: PendingPumpuangsService) {}

  @ApiOkResponse({ description: 'Pagination results of pending pumpuangs' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetPendingPumpuangQueryDto.name),
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
  @UseGuards(AuthGuard, RolesGuard)
  async getPendingPumpuang(
    @Query() getPendingPumpuangQueryDto: GetPendingPumpuangQueryDto,
  ): Promise<PaginationResponseDto<PendingPumpuangResponseDto>> {
    const result = await this.pendingPumpuangsService.getPendingPumpuang(getPendingPumpuangQueryDto);

    return PumpuangMapper.toPaginatedResponseDto(result, PumpuangMapper.toPendingResponseDto);
  }

  @ApiOkResponse({ description: 'Return pending share.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('pendingPumpuangId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingPumpuang.name) })
  @ApiForbiddenResponse({
    description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
  })
  @ApiParam({ name: 'pendingShareId' })
  @Get(':pendingPumpuangId')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(TransformFileInterceptor)
  async getPendingPumpuangById(
    @CurrentUser() user: IUser,
    @ObjectId('pendingPumpuangId') pendingPumpuangId: string,
  ): Promise<PendingPumpuangResponseDto> {
    const result = await this.pendingPumpuangsService.getPendingPumpuangById(user, pendingPumpuangId);

    return PumpuangMapper.toPendingResponseDto(result);
  }

  @ApiOkResponse({ description: 'Return sessionId.' })
  @Post('session')
  async requestSession(
    @Body() requestSessionDto: RequestSessionDto,
  ): Promise<RequestSessionResponseDto> {
    return this.pendingPumpuangsService.requestSession(requestSessionDto) as unknown as Promise<RequestSessionResponseDto>;
  }

  @ApiCreatedResponse({ description: 'Pending pumpuang created and return.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INVALID_REQ_BODY(CreatePendingPumpuangDto.name),
      DOC_DESCRIPTION.INVALID_FILE_POLICY(PUMPUANG_FILE_POLICY),
      DOC_DESCRIPTION.TEC_049,
      DOC_DESCRIPTION.TEC_050,
      DOC_DESCRIPTION.PHONE_NUMBER_BEING_USED,
    ),
  })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Post()
  @UseGuards(PendingPumpuangSessionGuard)
  @UseInterceptors(FileInterceptor('image'), TransformFileInterceptor)
  async createPendingPumpuang(
    @CurrentSession('tempId') sessionId: string,
    @Body() createPendingPumpuangDto: CreatePendingPumpuangDto,
    @UploadedFile(
      new FileValidationPipe(PUMPUANG_FILE_POLICY.type, PUMPUANG_FILE_POLICY.maxSize, true),
    )
    image: Express.Multer.File,
  ): Promise<PendingPumpuangResponseDto> {
    const result = await this.pendingPumpuangsService.createPendingPumpuang(
      sessionId,
      createPendingPumpuangDto,
      image,
    );

    return PumpuangMapper.toPendingResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Successfully upload additional image.' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_FILE_POLICY(PUMPUANG_FILE_POLICY),
  })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Post('upload-additional-image')
  @UseGuards(PendingPumpuangSessionGuard, ProxiedThrottlerGuard)
  @Throttle({ default: { limit: 60, ttl: minutes(15) } })
  @UseInterceptors(FilesInterceptor('image', CONFIG.MAX_UPLOADING_ADDITIONAL_IMAGE))
  async uploadAddtionalImage(
    @CurrentSession('tempId') sessionId: string,
    @UploadedFiles(new FileValidationPipe(PUMPUANG_FILE_POLICY.type, PUMPUANG_FILE_POLICY.maxSize))
    images: Array<Express.Multer.File>,
  ): Promise<string[]> {
    return this.pendingPumpuangsService.uploadAdditionalImage(sessionId, images);
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
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingPumpuang.name) })
  @ApiParam({ name: 'pendingPumpuangId' })
  @Post(':pendingPumpuangId/approve')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(TransformFileInterceptor)
  async approvePendingPumpuang(
    @CurrentUser() user: IUser,
    @ObjectId('pendingPumpuangId') pendingPumpuangId: string,
  ): Promise<PumpuangResponseDto> {
    const result = await this.pendingPumpuangsService.approvePendingPumpuang(user, pendingPumpuangId);

    return PumpuangMapper.toResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Reject pending pumpuang and set auto delete.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingPumpuangId'),
      DOC_DESCRIPTION.HAS_BEEN_REJECTED,
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingPumpuang.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'pendingPumpuangId' })
  @Post(':pendingPumpuangId/reject')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  async rejectPendingPumpuang(
    @CurrentUser() user: IUser,
    @ObjectId('pendingPumpuangId') pendingPumpuangId: string,
    @Body() { submissionMessage }: SubmissionMessageDto,
  ): Promise<void> {
    return this.pendingPumpuangsService.rejectPendingPumpuang(
      user,
      pendingPumpuangId,
      submissionMessage,
    );
  }

  @ApiOkResponse({ description: 'Pending share updated and return' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pendingPumpuangId'),
      DOC_DESCRIPTION.INVALID_REQ_BODY(UpdatePendingPumpuangDto.name),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.INVALID_FILE_POLICY(PUMPUANG_FILE_POLICY),
      DOC_DESCRIPTION.TEC_049,
      DOC_DESCRIPTION.TEC_050,
      DOC_DESCRIPTION.PHONE_NUMBER_BEING_USED,
    ),
  })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(PendingPumpuang.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'pendingPumpuangId' })
  @Put(':pendingPumpuangId')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), TransformFileInterceptor)
  async updatePendingPumpuang(
    @CurrentUser() user: IUser,
    @ObjectId('pendingPumpuangId') pendingPumpuangId: string,
    @Body() updatePendingPumpuangDto: UpdatePendingPumpuangDto,
    @UploadedFile(
      new FileValidationPipe(PUMPUANG_FILE_POLICY.type, PUMPUANG_FILE_POLICY.maxSize, false),
    )
    image: Express.Multer.File,
  ): Promise<PendingPumpuangResponseDto> {
    const result = await this.pendingPumpuangsService.updatePendingPumpuang(
      user,
      pendingPumpuangId,
      updatePendingPumpuangDto,
      image,
    );

    return PumpuangMapper.toPendingResponseDto(result);
  }

  @ApiParam({ name: 'pendingPumpuangId' })
  @Delete(':pendingPumpuangId/delete-additional-image')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteAdditionalImage(
    @CurrentUser() user: IUser,
    @ObjectId('pendingPumpuangId') pendingPumpuangId: string,
    @Query('fileName') fileName: string,
  ): Promise<PendingPumpuangResponseDto> {
    const result = await this.pendingPumpuangsService.deleteAdditionalImageUrl(user, pendingPumpuangId, fileName);

    return PumpuangMapper.toPendingResponseDto(result);
  }

  @ApiParam({ name: 'pendingPumpuangId' })
  @Post(':pendingPumpuangId/restore')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(TransformFileInterceptor)
  async restoreRejectedPendingPumpuang(
    @CurrentUser() user: IUser,
    @ObjectId('pendingPumpuangId') pendingPumpuangId: string,
  ): Promise<PendingPumpuangResponseDto> {
    const result = await this.pendingPumpuangsService.restoreRejectedPendingPumpuang(user, pendingPumpuangId);

    return PumpuangMapper.toPendingResponseDto(result);
  }
}
