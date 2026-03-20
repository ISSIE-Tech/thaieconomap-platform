import { Injectable, Logger } from '@nestjs/common';

import { Express } from 'express';
import { FilterQuery, Types } from 'mongoose';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../common/exceptions';
import { ANNOUNCEMENT_FILE_POLICY, CODES, MINIO_FOLDER } from '../../shared/constants';
import { IPaginationQuery, IPaginationResponse, IUser } from '../../shared/interfaces';
import { devErrorBuilder, getSpanName, prettyObjectString } from '../../shared/utils';
import { MapService } from '../map/map.service';
import { MinioClientService } from '../minio-client/minio-client.service';

import { AnnouncementsRepository } from './announcements.repository';
import {
  CreateAnnouncementDto,
  GetAnnouncementsQueryDto,
  GetPaginatedAnnouncementsQueryDto,
  UpdateAnnouncementDto,
} from './dto';
import { GetTinyAnnouncementsQueryDto } from './dto/get-tiny-annocements-filters.dto';
import { AnnouncementDocument } from './schemas';

@Injectable()
export class AnnouncementsService {
  constructor(
    private readonly announcementsRepository: AnnouncementsRepository,
    private readonly minioClientService: MinioClientService,
    private readonly mapService: MapService,
  ) {}

  private readonly logger: Logger = new Logger(AnnouncementsService.name);
  private readonly announcementSupportMimeType = ANNOUNCEMENT_FILE_POLICY.type;

  @Span('Get Announcements')
  async getAnnouncements(
    filters: FilterQuery<AnnouncementDocument>,
  ): Promise<AnnouncementDocument[]> {
    this.logger.debug(
      `{${AnnouncementsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        ...filters,
      })}`,
    );

    return this.announcementsRepository.find(filters);
  }

  @Span('Get All Announcements')
  async getAllAnnouncements(
    getAnnouncementsQueryDto: GetAnnouncementsQueryDto,
  ): Promise<AnnouncementDocument[]> {
    this.logger.debug(`{${AnnouncementsService.name}-[${getSpanName()}]} (called)`);

    const filters: FilterQuery<AnnouncementDocument> = {};
    const { districts } = getAnnouncementsQueryDto;

    if (districts) {
      filters.districts = { $in: districts };
    }

    return this.announcementsRepository.find(filters);
  }

  @Span('Get Paginated Announcements')
  async getPaginatedAnnouncements(
    getPaginatedAnnouncementsQueryDto: GetPaginatedAnnouncementsQueryDto,
  ): Promise<IPaginationResponse<AnnouncementDocument>> {
    const ctx = `${AnnouncementsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        ...getPaginatedAnnouncementsQueryDto,
      })}`,
    );

    const { date, district, ...filters } = getPaginatedAnnouncementsQueryDto;
    const query: IPaginationQuery<AnnouncementDocument> = filters;

    query.startAt = { $lte: date };
    query.endAt = { $gte: date };

    if (district) {
      query.districts = district;
    }

    this.logger.verbose(
      `{${ctx}} (find announcements by query) query:\n${prettyObjectString({
        query,
      })}`,
    );

    return this.announcementsRepository.findWithPagination(
      query,
      [],
      undefined, // projection fields
      ['districts'],
    );
  }

  @Span('Get All Tiny Announcements')
  async getAllTinyAnnouncements(
    getTinyAnnouncementsQueryDto: GetTinyAnnouncementsQueryDto,
  ): Promise<AnnouncementDocument[]> {
    const ctx = `${AnnouncementsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx} (called)\
      \n[param] ${prettyObjectString({
        ...getTinyAnnouncementsQueryDto,
      })}`,
    );

    const projection = {
      _id: 1,
      name: 1,
      startAt: 1,
      endAt: 1,
    };

    const { district, ...filter } = getTinyAnnouncementsQueryDto;
    const filters: FilterQuery<AnnouncementDocument> = filter;

    if (district) {
      filters.districts = new Types.ObjectId(district);
    }

    this.logger.verbose(
      `{${ctx}} (find announcements by query) query:\n${prettyObjectString({
        filters,
      })}`,
    );

    return this.announcementsRepository.findAnnouncementsByFilters(filters, projection);
  }

  @Span('Get Announcement By Id')
  async getAnnouncementById(announcementId: string): Promise<AnnouncementDocument> {
    this.logger.debug(
      `{${AnnouncementsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        announcementId,
      })}`,
    );

    const announcement = await this.announcementsRepository.findById(announcementId);

    if (!announcement) {
      throw new ErrorException(CODES.TEC_005);
    }

    return announcement;
  }

  @Span('Create Announcement')
  async createAnnouncement(
    user: IUser,
    createAnnouncementDto: CreateAnnouncementDto,
    pdf: Express.Multer.File,
  ) {
    const ctx = `${AnnouncementsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        user,
        createAnnouncementDto,
      })}`,
    );

    const { endAt, districts } = createAnnouncementDto;

    if (districts) {
      await this.checkIfDistrictsIdValid(districts);
    }

    const announcement = {
      ...createAnnouncementDto,
      createdAt: new Date(),
      createdBy: user._id,
      pdfUrl: pdf
        ? await this.minioClientService.upload(
            MINIO_FOLDER.announcements,
            pdf,
            this.announcementSupportMimeType,
          )
        : undefined,
      expiredAutoDelete: endAt,
    };

    this.logger.verbose(
      `{${ctx}} (created announcement) data:\n${prettyObjectString({
        announcement,
      })}`,
    );

    return this.announcementsRepository.create(announcement);
  }

  @Span('Update Announcement')
  async updateAnnouncement(
    announcementId: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
    pdf: Express.Multer.File,
  ) {
    const ctx = `${AnnouncementsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        announcementId,
        updateAnnouncementDto,
      })}`,
    );

    const { districts } = updateAnnouncementDto;

    if (districts) {
      await this.checkIfDistrictsIdValid(districts);
    }

    const announcement = await this.getAnnouncementById(announcementId);

    let pdfUrl = announcement.pdfUrl;

    if (pdf) {
      pdfUrl = pdfUrl
        ? await this.minioClientService.replaceFile(
            MINIO_FOLDER.announcements,
            pdf,
            pdfUrl,
            this.announcementSupportMimeType,
          )
        : await this.minioClientService.upload(
            MINIO_FOLDER.announcements,
            pdf,
            this.announcementSupportMimeType,
          );
    }

    const updates = {
      ...updateAnnouncementDto,
      pdfUrl,
    };

    this.logger.verbose(
      `{${ctx}} (update announcement data) data:\n${prettyObjectString({
        updates,
      })}`,
    );

    return this.announcementsRepository.findByIdAndUpdate(announcementId, updates);
  }

  @Span('Delete Announcement')
  async deleteAnnouncement(announcementId: string): Promise<AnnouncementDocument> {
    this.logger.debug(
      `{${AnnouncementsService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        announcementId,
      })}`,
    );

    const announcement = await this.getAnnouncementById(announcementId);

    if (announcement.pdfUrl) {
      await this.minioClientService.deleteFile(announcement.pdfUrl);
    }

    return this.announcementsRepository.findByIdAndDelete(announcementId);
  }

  @Span('Check If Districts Id Valid')
  private async checkIfDistrictsIdValid(districtsId: string[]): Promise<void> {
    const ctx = `${AnnouncementsService.name}-[${getSpanName()}]`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        districtsId,
      })}`,
    );

    const districtsSet = new Set(districtsId);

    if (districtsId.length !== districtsSet.size) {
      const duplicates = districtsId.filter(id => {
        const hasId = districtsSet.has(id);

        if (hasId) {
          districtsSet.delete(id);

          return false;
        }

        return true;
      });

      throw devErrorBuilder(CODES.TEC_001, `duplicates id: [${duplicates}]`);
    }

    const { isValid, missing } = await this.mapService.isDistrictsIdValid(districtsId);

    this.logger.verbose(
      `{${ctx}} (is district id valid) data:\n${prettyObjectString({
        isValid,
        missing,
      })}`,
    );

    if (!isValid) {
      throw devErrorBuilder(CODES.TEC_017, missing);
    }
  }
}
