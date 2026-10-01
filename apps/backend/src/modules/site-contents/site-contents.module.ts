import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';

import { SiteContent, SiteContentSchema } from './schemas/site-content.schema';
import { SiteContentsController } from './site-contents.controller';
import { SiteContentsService } from './site-contents.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: SiteContent.name, schema: SiteContentSchema }]), UsersModule],
  controllers: [SiteContentsController],
  providers: [SiteContentsService],
})
export class SiteContentsModule {}
