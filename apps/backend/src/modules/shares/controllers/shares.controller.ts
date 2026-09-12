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
  PaginationResponseDto,
  SearchLocation,
  ShareResponseDto,
  ShareTinyResponseDto,
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
import { CACHE_KEY, DOC_DESCRIPTION, SHARES_FILE_POLICY } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';
import { buildMultiLineDocDescription } from '../../../shared/utils';
import { CreateShareDto, GetSharesQueryDto, GetTinySharesQueryDto, UpdateShareDto } from '../dto';
import { ShareMapper } from '../mappers';
import { Share } from '../schemas';
import { SharesService } from '../services';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('shares')
@CacheTTL(CONFIG.RESPONSE_CACHE_TTL)
@ResponseCacheNamespace(CACHE_KEY.shares.prefix)
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  @ApiCreatedResponse({ description: 'Favorite to share.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('shareId'),
      DOC_DESCRIPTION.HAS_ALREADY_FAV,
      DOC_DESCRIPTION.REACH_MAX_FAV,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Share.name) })
  @ApiParam({ name: 'shareId' })
  @Post(':shareId/favorite')
  @UseGuards(AuthGuard)
  async favoriteShare(
    @CurrentUser() user: IUser,
    @ObjectId('shareId') shareId: string,
  ): Promise<FavoriteDocument> {
    return this.sharesService.favoriteShare(user, shareId);
  }

  @ApiOkResponse({ description: 'Unfavorite share.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('shareId') })
  @ApiNotFoundResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.ENTITY_NOT_FOUND(Share.name),
      DOC_DESCRIPTION.DOESNT_FAV_YET,
    ),
  })
  @ApiParam({ name: 'shareId' })
  @Delete(':shareId/unfavorite')
  @UseGuards(AuthGuard)
  async unfavoriteShare(
    @CurrentUser() user: IUser,
    @ObjectId('shareId') shareId: string,
  ): Promise<void> {
    return this.sharesService.unfavoriteShare(user, shareId);
  }

  @ApiOkResponse({ description: 'Return array of shares for mark on map.' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetTinySharesQueryDto.name),
  })
  @Get('tiny')
  @ResponseCacheQueryParam(`location=${SearchLocation.ANYWHERE}`)
  @UseInterceptors(ResponseCacheInterceptor, TransformFileInterceptor)
  async getAllTinySharesByQuery(
    @Query() getTinySharesQueryDto: GetTinySharesQueryDto,
  ): Promise<ShareTinyResponseDto[]> {
    const result = await this.sharesService.getAllTinySharesByQuery(getTinySharesQueryDto);

    return result.map(ShareMapper.toTinyResponseDto);
  }

  @ApiOkResponse({ description: 'Return array of full shares info for admin dashboard.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetSharesQueryDto.name) })
  @Get()
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(TransformFileInterceptor)
  async getPaginatedShares(
    @CurrentUser() user: IUser,
    @Query() getSharesQueryDto: GetSharesQueryDto,
  ): Promise<PaginationResponseDto<ShareResponseDto>> {
    const result = await this.sharesService.getPaginatedShares(user, getSharesQueryDto);

    return ShareMapper.toPaginatedResponseDto(result, ShareMapper.toResponseDto);
  }

  @ApiOkResponse({ description: 'Return share info for client.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('shareId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Share.name) })
  @ApiParam({ name: 'shareId' })
  @Get(':shareId/tiny')
  @OptionalAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(TransformFileInterceptor)
  async getTinySharesById(
    @CurrentUser() user: IUser,
    @ObjectId('shareId') shareId: string,
  ): Promise<ShareTinyResponseDto> {
    const result = await this.sharesService.getTinyShareById(user, shareId);

    return ShareMapper.toTinyResponseDto(result);
  }

  @ApiOkResponse({ description: 'Return full share info for admin dashboard.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('shareId') })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Share.name) })
  @ApiParam({ name: 'shareId' })
  @Get(':shareId')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(TransformFileInterceptor)
  async getShare(@ObjectId('shareId') shareId: string): Promise<ShareResponseDto> {
    const result = await this.sharesService.getShareById(shareId);

    return ShareMapper.toResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Share created and return.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INVALID_REQ_BODY(CreateShareDto.name),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.INVALID_FILE_POLICY(SHARES_FILE_POLICY),
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
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Post()
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.shares.all, CACHE_KEY.allShares.all)
  @UseInterceptors(CacheClearInterceptor, FileInterceptor('image'), TransformFileInterceptor)
  async createShare(
    @CurrentUser() user: IUser,
    @Body() createShareDto: CreateShareDto,
    @UploadedFile(new FileValidationPipe(SHARES_FILE_POLICY.type, SHARES_FILE_POLICY.maxSize))
    image: Express.Multer.File,
  ): Promise<ShareResponseDto> {
    const result = await this.sharesService.createShare(user, createShareDto, image);

    return ShareMapper.toResponseDto(result);
  }

  @ApiOkResponse({ description: 'Share updated and return' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('shareId'),
      DOC_DESCRIPTION.INVALID_REQ_BODY(UpdateShareDto.name),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.INVALID_FILE_POLICY(SHARES_FILE_POLICY, false),
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
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Share.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'shareId' })
  @Put(':shareId')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.shares.all, CACHE_KEY.allShares.all)
  @UseInterceptors(CacheClearInterceptor, FileInterceptor('image'), TransformFileInterceptor)
  async updateShare(
    @CurrentUser() user: IUser,
    @ObjectId('shareId') shareId: string,
    @Body() updateShareDto: UpdateShareDto,
    @UploadedFile(
      new FileValidationPipe(SHARES_FILE_POLICY.type, SHARES_FILE_POLICY.maxSize, false),
    )
    image: Express.Multer.File,
  ): Promise<ShareResponseDto> {
    const result = await this.sharesService.updateShare(user, shareId, updateShareDto, image);

    return ShareMapper.toResponseDto(result);
  }

  @ApiOkResponse({ description: 'Move share to deleted share.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('shareId') })
  @ApiForbiddenResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER),
      DOC_DESCRIPTION.TEC_008,
    ),
  })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Share.name) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'shareId' })
  @Delete(':shareId')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.shares.all, CACHE_KEY.allShares.all)
  @UseInterceptors(CacheClearInterceptor)
  async deleteShare(
    @CurrentUser() user: IUser,
    @ObjectId('shareId') shareId: string,
  ): Promise<ShareResponseDto> {
    const result = await this.sharesService.deleteShare(user, shareId);

    return ShareMapper.toResponseDto(result);
  }

  @ApiCreatedResponse({ description: 'Successfully upload additional image.' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_FILE_POLICY(SHARES_FILE_POLICY),
  })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @Post('upload-additional-image')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('image', CONFIG.MAX_UPLOADING_ADDITIONAL_IMAGE))
  async uploadAddtionalImage(
    @CurrentUser() user: IUser,
    @UploadedFiles(
      new FileValidationPipe(SHARES_FILE_POLICY.type, SHARES_FILE_POLICY.maxSize, true),
    )
    images: Array<Express.Multer.File>,
  ): Promise<string[]> {
    return this.sharesService.uploadAdditionalImage(user, images);
  }

  @ApiOkResponse({ description: 'Additional image deleted and return share.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('shareId'),
      DOC_DESCRIPTION.TEC_048(Share.name),
    ),
  })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Share.name) })
  @ApiParam({ name: 'shareId' })
  @Delete(':shareId/delete-additional-image')
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteAdditionalImage(
    @ObjectId('shareId') shareId: string,
    @Query('fileName') fileName: string,
  ): Promise<ShareResponseDto> {
    const result = await this.sharesService.deleteAdditionalImageUrl(shareId, fileName);

    return ShareMapper.toResponseDto(result);
  }
}
