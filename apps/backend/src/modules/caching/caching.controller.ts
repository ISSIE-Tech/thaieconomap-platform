import { Body, Controller, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserRole } from '@thaieconomap/contracts';

import { CacheClearKeys, CurrentUser, ObjectId, Roles } from '../../common/decorators';
import { AuthGuard, RolesGuard } from '../../common/guards';
import { CacheClearInterceptor } from '../../common/interceptors';
import { CACHE_KEY, DOC_DESCRIPTION } from '../../shared/constants';
import { IUser } from '../../shared/interfaces';

import { CachingService } from './caching.service';
import { CscJobsService } from './csc-jobs.service';
import { ListShopsDto, ListSourceSyncLogsDto, SetShopHiddenDto } from './dto';
import { SyncTrigger } from './schemas';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('caching')
export class CachingController {
  constructor(
    private readonly cachingService: CachingService,
    private readonly cscJobsService: CscJobsService,
  ) {}

  /**
   * The shop/base cache is otherwise only filled by the 1AM cron, so a fresh deployment
   * shows an empty map until the next night and a broken upstream config is not found
   * until then either. This runs the same sync on demand.
   *
   * The commercials response cache is dropped afterwards - it holds the map markers for
   * an hour, so without this a sync would appear to have done nothing.
   */
  @ApiOkResponse({ description: 'Shop and base cache refreshed from tamsang-tamsong.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Post('sync')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.commercials.all)
  @UseInterceptors(CacheClearInterceptor)
  async syncShopAndBaseCache(@CurrentUser() user: IUser): Promise<{ message: string }> {
    await this.cachingService.updateShopAndBaseCache(
      SyncTrigger.MANUAL,
      user.displayName || user.name || user.email || null,
    );

    return { message: 'Shop and base cache updated' };
  }

  // Same idea as the shop sync, for the csc job cache the job map reads (normally hourly).
  @ApiOkResponse({ description: 'Job cache refreshed from csc-backend.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Post('csc-jobs/sync')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async syncCscJobs(@CurrentUser() user: IUser): Promise<{ message: string }> {
    await this.cscJobsService.syncJobs(
      SyncTrigger.MANUAL,
      user.displayName || user.name || user.email || null,
    );

    return { message: 'Job cache updated' };
  }

  @ApiOkResponse({ description: 'Shops cached from tamsang-tamsong.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Post('shops')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async listShops(@Body() dto: ListShopsDto) {
    return this.cachingService.listShops(dto.search, Number(dto.page ?? 1), Number(dto.limit ?? 20));
  }

  // All cached nodes; there are few enough that the admin pages through them client-side.
  @ApiOkResponse({ description: 'Bases cached from tamsang-tamsong.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Post('bases')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async listBases() {
    return this.cachingService.listBases();
  }

  // Hides a tamsang shop from the public map without touching tamsang itself.
  @ApiOkResponse({ description: 'Shop visibility updated.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('shopId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND('Shop') })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @ApiParam({ name: 'shopId' })
  @Patch('shops/:shopId/hidden')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.commercials.all)
  @UseInterceptors(CacheClearInterceptor)
  async setShopHidden(@ObjectId('shopId') shopId: string, @Body() dto: SetShopHiddenDto) {
    return this.cachingService.setShopHidden(shopId, dto.hidden);
  }

  @ApiOkResponse({ description: 'History of cache syncs for one source, newest first.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Post('sync-logs')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async listSyncLogs(@Body() dto: ListSourceSyncLogsDto) {
    return this.cachingService.listSyncLogs(
      Number(dto.page ?? 1),
      Number(dto.limit ?? 20),
      dto.source,
    );
  }
}
