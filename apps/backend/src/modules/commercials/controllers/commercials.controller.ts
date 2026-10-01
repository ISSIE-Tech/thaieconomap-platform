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

import {
  CommercialResponseDto,
  CommercialTinyResponseDto,
  CommercialWorkingHour,
  PaginationResponseDto,
  SearchLocation,
  UserRole,
} from '@thaieconomap/contracts';
import { Express } from 'express';

import {
  CacheClearKeys,
  CurrentUser,
  ExcludeRoles,
  ObjectId,
  OptionalAuth,
  ResponseCacheNamespace,
  ResponseCacheQueryParam,
} from '../../../common/decorators';
import { AuthGuard, RolesGuard } from '../../../common/guards';
import {
  CacheClearInterceptor,
  ResponseCacheInterceptor,
  TransformFileInterceptor,
} from '../../../common/interceptors';
import { FileValidationPipe } from '../../../common/pipes';
import { CONFIG } from '../../../config';
import { FavoriteDocument } from '../../../modules/users/schemas';
import { CACHE_KEY, COMMERCIAL_FILE_POLICY, DOC_DESCRIPTION } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';
import { buildMultiLineDocDescription } from '../../../shared/utils';
import {
  CreateCommercialDto,
  GetCommercialsQueryDto,
  GetCommercialsTinyQueryDto,
  UpdateCommercialDto,
} from '../dto';
import { CommercialMapper } from '../mappers';
import { Commercial } from '../schemas';
import { CommercialsService } from '../services/commercials.service';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('commercials')
@CacheTTL(CONFIG.RESPONSE_CACHE_TTL)
@ResponseCacheNamespace(CACHE_KEY.commercials.prefix)
export class CommercialsController {
  constructor(private readonly commercialsService: CommercialsService) {}

  @ApiOkResponse({ description: 'Return array of full commercials info for admin dashboard.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetCommercialsQueryDto.name),
  })
  @Get()
  @UseInterceptors(TransformFileInterceptor)
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  async getCommercials(
    @CurrentUser() user: IUser,
    @Query() getCommercialsQueryDto: GetCommercialsQueryDto,
  ): Promise<PaginationResponseDto<CommercialResponseDto>> {
    const result = await this.commercialsService.getCommercials(user, getCommercialsQueryDto);

    return CommercialMapper.toPaginatedResponseDto(result, CommercialMapper.toResponseDto);
  }

  @ApiOkResponse({ description: 'Return array of commercials for mark on map.' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetCommercialsTinyQueryDto.name),
  })
  @Get('tiny')
  @ResponseCacheQueryParam(
    'category',
    `workingHour=${CommercialWorkingHour.ANYTIME}`,
    `location=${SearchLocation.ANYWHERE}`,
  )
  // presign imageUrl like the detail route: the list now feeds sidebar/related-shop thumbnails
  @UseInterceptors(ResponseCacheInterceptor, TransformFileInterceptor)
  async getCommercialsTiny(
    @Query() getCommercialsTinyQueryDto: GetCommercialsTinyQueryDto,
  ): Promise<CommercialTinyResponseDto[]> {
    const result = await this.commercialsService.getShopsAndCommercials(getCommercialsTinyQueryDto);

    return result.map(CommercialMapper.toTinyResponseDto);
  }

  @ApiOkResponse({ description: 'Return full commercial info for admin dashboard.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('commercialId') })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetCommercialsTinyQueryDto.name),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Commercial.name) })
  @ApiParam({ name: 'commercialId' })
  @Get(':commercialId')
  @UseInterceptors(TransformFileInterceptor)
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  async getCommercial(@CurrentUser() user: IUser, @ObjectId('commercialId') commercialId: string): Promise<CommercialResponseDto> {
    const result = await this.commercialsService.getCommercialById(user, commercialId);

    return CommercialMapper.toResponseDto(result);
  }

  @ApiOkResponse({ description: 'Return commercial info for client.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('commercialId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Commercial.name) })
  @ApiParam({ name: 'commercialId' })
  @Get(':commercialId/tiny')
  @UseInterceptors(TransformFileInterceptor)
  @OptionalAuth()
  @UseGuards(AuthGuard)
  async getCommercialTiny(
    @CurrentUser() user: IUser,
    @ObjectId('commercialId') commercialId: string,
  ): Promise<CommercialTinyResponseDto> {
    const result = await this.commercialsService.getShopsAndCommercialsById(user, commercialId);

    return CommercialMapper.toTinyResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Successfully upload additional image.' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_FILE_POLICY(COMMERCIAL_FILE_POLICY),
  })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Post('upload-additional-image')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('image', CONFIG.MAX_UPLOADING_ADDITIONAL_IMAGE))
  async uploadAddtionalImage(
    @CurrentUser() user: IUser,
    @UploadedFiles(
      new FileValidationPipe(COMMERCIAL_FILE_POLICY.type, COMMERCIAL_FILE_POLICY.maxSize),
    )
    images: Array<Express.Multer.File>,
  ): Promise<string[]> {
    return this.commercialsService.uploadAdditionalImage(user, images);
  }

  @ApiCreatedResponse({ description: 'Commercial created and return.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INVALID_REQ_BODY(CreateCommercialDto.name),
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
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Post()
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.commercials.all, CACHE_KEY.allCommercials.all)
  @UseInterceptors(CacheClearInterceptor, FileInterceptor('image'), TransformFileInterceptor)
  async createCommercial(
    @CurrentUser() user: IUser,
    @Body() createCommercialDto: CreateCommercialDto,
    @UploadedFile(
      new FileValidationPipe(COMMERCIAL_FILE_POLICY.type, COMMERCIAL_FILE_POLICY.maxSize, true),
    )
    image: Express.Multer.File,
  ): Promise<CommercialResponseDto> {
    const result = await this.commercialsService.createCommercial(user, createCommercialDto, image);

    return CommercialMapper.toResponseDto(result);
  }

  @ApiOkResponse({ description: 'Additional image deleted and return commercial.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('commercialId'),
      DOC_DESCRIPTION.TEC_048(Commercial.name),
    ),
  })
  @ApiForbiddenResponse({
    description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Commercial.name) })
  @ApiParam({ name: 'commercialId' })
  @Delete(':commercialId/delete-additional-image')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.commercials.all, CACHE_KEY.allCommercials.all)
  @UseInterceptors(CacheClearInterceptor)
  async deleteAdditionalImage(
    @CurrentUser() user: IUser,
    @ObjectId('commercialId') commercialId: string,
    @Query('fileName') fileName: string,
  ): Promise<CommercialResponseDto> {
    const result = await this.commercialsService.deleteAdditionalImageUrl(user, commercialId, fileName);

    return CommercialMapper.toResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Favorite to commercial.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('commercialId'),
      DOC_DESCRIPTION.HAS_ALREADY_FAV,
      DOC_DESCRIPTION.REACH_MAX_FAV,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Commercial.name) })
  @ApiParam({ name: 'commercialId' })
  @Post(':commercialId/favorite')
  @UseGuards(AuthGuard)
  async favoriteCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('commercialId') commercialId: string,
  ): Promise<FavoriteDocument> {
    return this.commercialsService.favoriteCommercial(user, commercialId);
  }

  @ApiOkResponse({ description: 'Commercial updated and return.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INVALID_REQ_BODY(UpdateCommercialDto.name),
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
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Commercial.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'commercialId' })
  @Put(':commercialId')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.commercials.all, CACHE_KEY.allCommercials.all)
  @UseInterceptors(CacheClearInterceptor, FileInterceptor('image'), TransformFileInterceptor)
  async updateCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('commercialId') commercialId: string,
    @Body() updateCommercialDto: UpdateCommercialDto,
    @UploadedFile(
      new FileValidationPipe(COMMERCIAL_FILE_POLICY.type, COMMERCIAL_FILE_POLICY.maxSize, false),
    )
    image: Express.Multer.File,
  ): Promise<CommercialResponseDto> {
    const result = await this.commercialsService.updateCommercial(user, commercialId, updateCommercialDto, image);

    return CommercialMapper.toResponseDto(result);
  }

  @ApiOkResponse({ description: 'Move commercial to deleted commercial.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('commercialId') })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Commercial.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'commercialId' })
  @Delete(':commercialId')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.commercials.all, CACHE_KEY.allCommercials.all)
  @UseInterceptors(CacheClearInterceptor)
  async deleteCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('commercialId') commercialId: string,
  ): Promise<CommercialResponseDto> {
    const result = await this.commercialsService.deleteCommercial(user, commercialId);

    return CommercialMapper.toResponseDto(result);
  }

  @ApiOkResponse({ description: 'Unfavorite commercial.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('commercialId') })
  @ApiNotFoundResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.ENTITY_NOT_FOUND(Commercial.name),
      DOC_DESCRIPTION.DOESNT_FAV_YET,
    ),
  })
  @ApiParam({ name: 'commercialId' })
  @Delete(':commercialId/unfavorite')
  @UseGuards(AuthGuard)
  async unfavoriteCommercial(
    @CurrentUser() user: IUser,
    @ObjectId('commercialId') commercialId: string,
  ): Promise<void> {
    return this.commercialsService.unfavoriteCommercial(user, commercialId);
  }
}
