import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MapModule } from '../map/map.module';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { UsersModule } from '../users/users.module';

import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsRepository } from './announcements.repository';
import { AnnouncementsService } from './announcements.service';
import { Announcement, AnnouncementSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Announcement.name, schema: AnnouncementSchema }]),
    MinioClientModule,
    UsersModule,
    MapModule,
  ],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsRepository, AnnouncementsService],
})
export class AnnouncementsModule {}
