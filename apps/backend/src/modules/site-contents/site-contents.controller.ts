import { Body, Controller, Get, Param, ParseEnumPipe, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UserRole } from '@thaieconomap/contracts';
import { IsObject } from 'class-validator';

import { CurrentUser, Roles } from '../../common/decorators';
import { AuthGuard, RolesGuard } from '../../common/guards';
import { IUser } from '../../shared/interfaces';

import { SiteContentKey } from './schemas/site-content.schema';
import { SiteContentsService } from './site-contents.service';

class UpdateSiteContentDto {
  @IsObject()
  strings: Record<string, { th: string; en: string }>;
}

@ApiTags('Site contents')
@Controller('site-contents')
export class SiteContentsController {
  constructor(private readonly siteContentsService: SiteContentsService) {}

  @ApiOkResponse({ description: 'Page copy (saved values merged over built-in defaults).' })
  @Get(':key')
  async get(@Param('key', new ParseEnumPipe(SiteContentKey)) key: SiteContentKey) {
    return this.siteContentsService.get(key);
  }

  // Values are rendered as HTML on the about page, so only admins may write them.
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Page copy saved and returned.' })
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':key')
  async update(
    @Param('key', new ParseEnumPipe(SiteContentKey)) key: SiteContentKey,
    @Body() dto: UpdateSiteContentDto,
    @CurrentUser() user: IUser,
  ) {
    return this.siteContentsService.update(key, dto.strings, user._id);
  }
}
