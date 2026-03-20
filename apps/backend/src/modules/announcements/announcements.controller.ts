import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

import { AnnouncementResponseDto, UserRole } from '@thaieconomap/contracts';
import { Express } from 'express';

import { CurrentUser, ExcludeRoles, ObjectId } from '../../common/decorators';
import { AuthGuard, RolesGuard } from '../../common/guards';
import { TransformFileInterceptor } from '../../common/interceptors';
import { FileValidationPipe } from '../../common/pipes';
import { ANNOUNCEMENT_FILE_POLICY, DOC_DESCRIPTION } from '../../shared/constants';
import { IUser } from '../../shared/interfaces';
import { buildMultiLineDocDescription } from '../../shared/utils';

import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto, GetAnnouncementsQueryDto, UpdateAnnouncementDto } from './dto';
import { GetTinyAnnouncementsQueryDto } from './dto/get-tiny-annocements-filters.dto';
import { AnnouncementMapper } from './mappers';
import { Announcement } from './schemas/announcement.schema';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @ApiOkResponse({ description: 'Return array of announcement dashboard.' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetTinyAnnouncementsQueryDto.name),
  })
  @Get('tiny')
  async getAnnouncementsBoard(
    @Query() getTinyAnnouncementsFiltersDto: GetTinyAnnouncementsQueryDto,
  ): Promise<AnnouncementResponseDto[]> {
    const docs = await this.announcementsService.getAllTinyAnnouncements(getTinyAnnouncementsFiltersDto);

    return docs.map(AnnouncementMapper.toResponseDto);
  }

  @ApiOkResponse({ description: 'Return array of announcement dashboard.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetAnnouncementsQueryDto.name),
  })
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(TransformFileInterceptor)
  @Get()
  async getPaginatedAnnouncements(
    @Query() getAnnouncementsQueryDto: GetAnnouncementsQueryDto,
  ): Promise<AnnouncementResponseDto[]> {
    const docs = await this.announcementsService.getAllAnnouncements(getAnnouncementsQueryDto);

    return docs.map(AnnouncementMapper.toResponseDto);
  }

  @ApiOkResponse({ description: 'Return Announcement info for client.' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.MUST_BE_MONGOID('announcementId'),
  })
  @ApiNotFoundResponse({
    description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Announcement.name),
  })
  @ApiParam({ name: 'announcementId' })
  @Get(':announcementId')
  @UseInterceptors(TransformFileInterceptor)
  async getAnnouncementById(
    @ObjectId('announcementId') announcementId: string,
  ): Promise<AnnouncementResponseDto> {
    const doc = await this.announcementsService.getAnnouncementById(announcementId);

    return AnnouncementMapper.toResponseDto(doc);
  }

  @ApiCreatedResponse({ description: 'Announcement created and return.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.INVALID_REQ_BODY(CreateAnnouncementDto.name),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.INVALID_FILE_POLICY(ANNOUNCEMENT_FILE_POLICY),
    ),
  })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
  @ApiServiceUnavailableResponse({
    description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE,
  })
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('pdf'), TransformFileInterceptor)
  @Post()
  async createAnnouncement(
    @CurrentUser() user: IUser,
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @UploadedFile(
      new FileValidationPipe(ANNOUNCEMENT_FILE_POLICY.type, ANNOUNCEMENT_FILE_POLICY.maxSize),
    )
    pdf: Express.Multer.File,
  ): Promise<AnnouncementResponseDto> {
    const doc = await this.announcementsService.createAnnouncement(user, createAnnouncementDto, pdf);

    return AnnouncementMapper.toResponseDto(doc);
  }

  @ApiCreatedResponse({ description: 'Announcement updated and return.' })
  @ApiBadRequestResponse({
    description: buildMultiLineDocDescription(
      DOC_DESCRIPTION.MUST_BE_MONGOID('announcementId'),
      DOC_DESCRIPTION.INVALID_REQ_BODY(CreateAnnouncementDto.name),
      DOC_DESCRIPTION.TEC_017,
      DOC_DESCRIPTION.INVALID_FILE_POLICY(ANNOUNCEMENT_FILE_POLICY, false),
    ),
  })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
  @ApiNotFoundResponse({
    description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Announcement.name),
  })
  @ApiServiceUnavailableResponse({
    description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE,
  })
  @ApiParam({ name: 'announcementId' })
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('pdf'), TransformFileInterceptor)
  @Put(':announcementId')
  async updateAnnouncement(
    @ObjectId('announcementId') announcementId: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @UploadedFile(
      new FileValidationPipe(
        ANNOUNCEMENT_FILE_POLICY.type,
        ANNOUNCEMENT_FILE_POLICY.maxSize,
        false,
      ),
    )
    pdf: Express.Multer.File,
  ): Promise<AnnouncementResponseDto> {
    const doc = await this.announcementsService.updateAnnouncement(announcementId, updateAnnouncementDto, pdf);

    return AnnouncementMapper.toResponseDto(doc);
  }

  @ApiOkResponse({ description: 'Announcement deleted and return.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('announcementId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(Announcement.name) })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
  @ApiServiceUnavailableResponse({ description: DOC_DESCRIPTION.FAILED_TO_MANIPULATE_FILE })
  @ApiParam({ name: 'announcementId' })
  @ExcludeRoles(UserRole.CUSTOMER)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':announcementId')
  async deleteAnnouncement(
    @ObjectId('announcementId') announcementId: string,
  ): Promise<AnnouncementResponseDto> {
    const doc = await this.announcementsService.deleteAnnouncement(announcementId);

    return AnnouncementMapper.toResponseDto(doc);
  }
}
