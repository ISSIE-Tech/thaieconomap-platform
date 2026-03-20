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
  ApiOperation,
  ApiParam,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle, minutes } from '@nestjs/throttler';

import {
  PaginationResponseDto,
  PumpuangAuthResponseDto,
  PumpuangLocationTrackingResponseDto,
  PumpuangRequestOtpResponseDto,
  PumpuangResponseDto,
  PumpuangRouteResponseDto,
  PumpuangStatus,
  PumpuangTinyResponseDto,
  UserRole,
} from '@thaieconomap/contracts';
import { Express } from 'express';

import { CurrentUser, ExcludeRoles, ObjectId, OptionalAuth } from '../../../common/decorators';
import {
  AuthGuard,
  ProxiedThrottlerGuard,
  PumpuangJwtAccessGuard,
  PumpuangJwtRefreshGuard,
  RolesGuard,
} from '../../../common/guards';
import { TransformFileInterceptor, TransformPumpuangLocation } from '../../../common/interceptors';
import { FileValidationPipe } from '../../../common/pipes';
import { CONFIG } from '../../../config';
import { RemoveFcmTokenDto, UpdateFcmTokenDto } from '../../../modules/notifications/dto';
import { DeviceTokenRepository } from '../../../modules/notifications/repositories';
import { FavoriteDocument } from '../../../modules/users/schemas';
import { DOC_DESCRIPTION, PUMPUANG_FILE_POLICY } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';
import { ICredentials } from '../../../shared/interfaces/token.interface';
import { buildMultiLineDocDescription } from '../../../shared/utils';
import {
  CreatePumpuangDto,
  GetPumpuangTinyQueryDto,
  GetPumpuangsQueryDto,
  PumpuangLocationDto,
  RequestOtpDto,
  UpdatePumpuangDto,
  VerifyOtpDto,
} from '../dto';
import { PumpuangMapper } from '../mappers';
import { Pumpuang, PumpuangDocument } from '../schemas';
import { PumpuangsService } from '../services';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('pumpuangs')
export class PumpuangsController {
  constructor(
    private readonly pumpuangService: PumpuangsService,
    private readonly deviceTokenRepository: DeviceTokenRepository,
  ) {}

  @ApiOkResponse({ description: 'Return array of full pumpuangs info for admin dashboard.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetPumpuangsQueryDto.name),
  })
  @Get()
  @UseInterceptors(TransformFileInterceptor)
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  async getPendingPumpuang(
    @Query() getPumpuangsQueryDto: GetPumpuangsQueryDto,
  ): Promise<PaginationResponseDto<PumpuangResponseDto>> {
    const result = await this.pumpuangService.getPumpuang(getPumpuangsQueryDto);

    return PumpuangMapper.toPaginatedResponseDto(result, PumpuangMapper.toResponseDto);
  }

  @ApiOkResponse({ description: 'Return array of pumpuangs for display on map.' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetPumpuangTinyQueryDto.name),
  })
  @Get('tiny')
  @UseInterceptors(TransformPumpuangLocation)
  async getPumpuangTiny(
    @Query() getPumpuangTinyQueryDto: GetPumpuangTinyQueryDto,
  ): Promise<PumpuangTinyResponseDto[]> {
    const result = await this.pumpuangService.getAllTinyPumpuangByQuery(getPumpuangTinyQueryDto);

    return result.map(PumpuangMapper.toTinyResponseDto);
  }

  @ApiOkResponse({ description: 'Return pumpuang profile' })
  @Get('app/profile')
  @UseInterceptors(TransformFileInterceptor)
  @UseGuards(PumpuangJwtAccessGuard)
  async getPumpuangProfile(@CurrentUser() pumpuang: PumpuangDocument): Promise<PumpuangResponseDto> {
    return PumpuangMapper.toResponseDto(pumpuang);
  }

  @ApiOkResponse({ description: 'Return pumpuang route' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('pumpuangId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Pumpuang.name) })
  @ApiParam({ name: 'pumpuangId' })
  @Get(':pumpuangId/route')
  @UseInterceptors(TransformPumpuangLocation)
  async getPumpuangRoute(
    @ObjectId('pumpuangId') pumpuangId: string,
  ): Promise<PumpuangRouteResponseDto> {
    return this.pumpuangService.getPumpuangRoute(pumpuangId) as unknown as Promise<PumpuangRouteResponseDto>;
  }

  @ApiOkResponse({ description: 'Return by pumpuang' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('pumpuangId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Pumpuang.name) })
  @ApiParam({ name: 'pumpuangId' })
  @Get(':pumpuangId')
  @OptionalAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(TransformFileInterceptor)
  async getPumpuangById(
    @CurrentUser() user: IUser,
    @ObjectId('pumpuangId') pumpuangId: string,
  ): Promise<PumpuangResponseDto> {
    const result = await this.pumpuangService.getPumpuangById(user, pumpuangId);

    return PumpuangMapper.toResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Create pumpuang' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INVALID_REQ_BODY(CreatePumpuangDto.name),
      DOC_DESCRIPTION.INVALID_FILE_POLICY(PUMPUANG_FILE_POLICY),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.TEC_049,
      DOC_DESCRIPTION.TEC_050,
    ),
  })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Post()
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), TransformFileInterceptor)
  async createPumpuang(
    @CurrentUser() user: IUser,
    @Body() createPumpuangDto: CreatePumpuangDto,
    @UploadedFile(
      new FileValidationPipe(PUMPUANG_FILE_POLICY.type, PUMPUANG_FILE_POLICY.maxSize, true),
    )
    image: Express.Multer.File,
  ): Promise<PumpuangResponseDto> {
    const result = await this.pumpuangService.createPumpuang(user, createPumpuangDto, image);

    return PumpuangMapper.toResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Start tracking pumpuang' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.PUMPUANG_IS_RUNNING })
  @Post('app/tracking/start')
  @UseGuards(ProxiedThrottlerGuard, PumpuangJwtAccessGuard)
  @Throttle({ default: { limit: 60, ttl: minutes(15) } })
  async startPumpuangLocationTracking(
    @CurrentUser() pumpuang: PumpuangDocument,
  ): Promise<{ status: PumpuangStatus }> {
    return this.pumpuangService.startPumpuangRiderTracking(pumpuang);
  }

  @ApiCreatedResponse({ description: 'Pumpuang location sent' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.PUMPUANG_IS_NOT_RUNNING,
      DOC_DESCRIPTION.INVALID_REQ_BODY(PumpuangLocationDto.name),
    ),
  })
  @Post('app/tracking')
  @UseGuards(PumpuangJwtAccessGuard)
  async pumpuangLocationTracking(
    @CurrentUser() pumpuang: PumpuangDocument,
    @Body() locationDto: PumpuangLocationDto,
  ): Promise<PumpuangLocationTrackingResponseDto> {
    return this.pumpuangService.pumpuangRiderTracking(pumpuang, locationDto) as unknown as Promise<PumpuangLocationTrackingResponseDto>;
  }

  @ApiCreatedResponse({ description: 'Stop tracking pumpuang' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.PUMPUANG_IS_NOT_RUNNING })
  @Post('app/tracking/stop')
  @UseGuards(ProxiedThrottlerGuard, PumpuangJwtAccessGuard)
  @Throttle({ default: { limit: 60, ttl: minutes(15) } })
  async stopPumpuangLocationTracking(
    @CurrentUser() pumpuang: PumpuangDocument,
  ): Promise<{ status: PumpuangStatus }> {
    return this.pumpuangService.stopPumpuangRiderTracking(pumpuang);
  }

  @ApiCreatedResponse({ description: 'Successfully upload additional image.' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_FILE_POLICY(PUMPUANG_FILE_POLICY),
  })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Post('upload-additional-image')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('image', CONFIG.MAX_UPLOADING_ADDITIONAL_IMAGE))
  async uploadAddtionalImage(
    @CurrentUser() user: IUser,
    @UploadedFiles(new FileValidationPipe(PUMPUANG_FILE_POLICY.type, PUMPUANG_FILE_POLICY.maxSize))
    images: Array<Express.Multer.File>,
  ): Promise<string[]> {
    return this.pumpuangService.uploadAdditionalImage(user, images);
  }

  @ApiOkResponse({ description: 'Pumpuang updated and return' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pumpuangId'),
      DOC_DESCRIPTION.INVALID_REQ_BODY(UpdatePumpuangDto.name),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.INVALID_FILE_POLICY(PUMPUANG_FILE_POLICY, false),
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
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Pumpuang.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'pumpuangId' })
  @Put(':pumpuangId')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), TransformFileInterceptor)
  async updatePumpuang(
    @CurrentUser() user: IUser,
    @ObjectId('pumpuangId') pumpuangId: string,
    @Body() updatePumpuangDto: UpdatePumpuangDto,
    @UploadedFile(
      new FileValidationPipe(PUMPUANG_FILE_POLICY.type, PUMPUANG_FILE_POLICY.maxSize, false),
    )
    image: Express.Multer.File,
  ): Promise<PumpuangResponseDto> {
    const result = await this.pumpuangService.updatePumpuang(user, pumpuangId, updatePumpuangDto, image);

    return PumpuangMapper.toResponseDto(result);
  }

  @ApiOkResponse({ description: 'Delete additional image' })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Delete(':pumpuangId/delete-additional-image')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteAdditionalImage(
    @CurrentUser() user: IUser,
    @ObjectId('pumpuangId') pumpuangId: string,
    @Query('fileName') fileName: string,
  ): Promise<PumpuangResponseDto> {
    const result = await this.pumpuangService.deleteAdditionalImageUrl(user, pumpuangId, fileName);

    return PumpuangMapper.toResponseDto(result);
  }

  @ApiOkResponse({ description: 'Move pumpuang to deleted status' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('pumpuangId') })
  @ApiNotFoundResponse({
    description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Pumpuang.name),
  })
  @ApiParam({ name: 'pumpuangId' })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Delete(':pumpuangId')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  async deletePumpuangById(
    @CurrentUser() user: IUser,
    @ObjectId('pumpuangId') pumpuangId: string,
  ): Promise<PumpuangResponseDto> {
    const result = await this.pumpuangService.deletePumpuang(user, pumpuangId);

    return PumpuangMapper.toResponseDto(result);
  }

  @ApiOkResponse({ description: 'Unfavorite pumpuang.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('pumpuangId') })
  @ApiNotFoundResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.ENTITY_NOT_FOUND(Pumpuang.name),
      DOC_DESCRIPTION.DOESNT_FAV_YET,
    ),
  })
  @ApiParam({ name: 'pumpuangId' })
  @Delete(':pumpuangId/unfavorite')
  @UseGuards(AuthGuard)
  async unfavoritePumpuang(
    @CurrentUser() user: IUser,
    @ObjectId('pumpuangId') pumpuangId: string,
  ): Promise<void> {
    return this.pumpuangService.unfavoritePumpuang(user, pumpuangId);
  }

  @ApiOperation({ summary: 'Register or update FCM device token for push notifications' })
  @ApiOkResponse({ description: 'FCM token registered' })
  @Put('app/fcm-token')
  @UseGuards(PumpuangJwtAccessGuard)
  async updateFcmToken(
    @CurrentUser('_id') pumpuangId: string,
    @Body() dto: UpdateFcmTokenDto,
  ): Promise<void> {
    await this.deviceTokenRepository.upsertToken(pumpuangId, dto.token, dto.platform);
  }

  @ApiOperation({ summary: 'Remove FCM device token (on logout)' })
  @ApiOkResponse({ description: 'FCM token removed' })
  @Delete('app/fcm-token')
  @UseGuards(PumpuangJwtAccessGuard)
  async removeFcmToken(@Body() dto: RemoveFcmTokenDto): Promise<void> {
    await this.deviceTokenRepository.removeToken(dto.token);
  }

  @ApiCreatedResponse({ description: 'Send otp to phone number due to req body' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(RequestOtpDto.name),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Pumpuang.name) })
  @Post('app/auth/otp/request')
  async pumpuangRequestOtp(
    @Body() requestOtpDto: RequestOtpDto,
  ): Promise<PumpuangRequestOtpResponseDto> {
    return this.pumpuangService.pumpuangRequestOtp(requestOtpDto) as unknown as Promise<PumpuangRequestOtpResponseDto>;
  }

  @ApiCreatedResponse({ description: 'Verify otp due to phone number' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(VerifyOtpDto.name),
  })
  @ApiNotFoundResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.ENTITY_NOT_FOUND(Pumpuang.name),
      DOC_DESCRIPTION.ENTITY_NOT_FOUND('OTP'),
    ),
  })
  @Post('app/auth/otp/verify')
  async pumpuangVerifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<PumpuangAuthResponseDto> {
    return this.pumpuangService.pumpuangVerifyOtp(verifyOtpDto) as unknown as Promise<PumpuangAuthResponseDto>;
  }

  @ApiCreatedResponse({ description: 'New credential created' })
  @Post('app/auth/refresh')
  @UseGuards(PumpuangJwtRefreshGuard)
  async pumpuangRefresh(@CurrentUser('_id') pumpuangId: string): Promise<ICredentials> {
    return this.pumpuangService.generatePumpuangCredentials(pumpuangId);
  }

  @ApiCreatedResponse({ description: 'Clear pumpuang refresh token' })
  @Post('app/auth/revoke')
  @UseGuards(PumpuangJwtAccessGuard)
  async pumpuangRevokeToken(@CurrentUser('_id') pumpuangId: string): Promise<void> {
    await this.pumpuangService.revokeRefreshToken(pumpuangId);
  }

  @ApiCreatedResponse({ description: 'Favorite to pumpuang.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('pumpuangId'),
      DOC_DESCRIPTION.HAS_ALREADY_FAV,
      DOC_DESCRIPTION.REACH_MAX_FAV,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Pumpuang.name) })
  @ApiParam({ name: 'pumpuangId' })
  @Post(':pumpuangId/favorite')
  @UseGuards(AuthGuard)
  async favoritePumpuang(
    @CurrentUser() user: IUser,
    @ObjectId('pumpuangId') pumpuangId: string,
  ): Promise<FavoriteDocument> {
    return this.pumpuangService.favoritePumpuang(user, pumpuangId);
  }
}
