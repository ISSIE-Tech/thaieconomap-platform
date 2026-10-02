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

// Every response-cache namespace; CACHE_KEY entries without a prefix (pumpuang) are app state.
const RESPONSE_CACHE_KEYS = Object.values(CACHE_KEY).flatMap(key =>
  'prefix' in key ? [`${key.prefix}*`] : [],
);

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

  // Takes a whole tamsang node (and every shop under it) off the public map.
  @ApiOkResponse({ description: 'Base visibility updated.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('baseId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND('Base') })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @ApiParam({ name: 'baseId' })
  @Patch('bases/:baseId/hidden')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(CACHE_KEY.commercials.all)
  @UseInterceptors(CacheClearInterceptor)
  async setBaseHidden(@ObjectId('baseId') baseId: string, @Body() dto: SetShopHiddenDto) {
    return this.cachingService.setBaseHidden(baseId, dto.hidden);
  }

  @ApiOkResponse({ description: 'Jobs cached from csc-backend.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Post('csc-jobs')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async listCscJobs(@Body() dto: ListShopsDto) {
    return this.cscJobsService.listJobPosts(
      dto.search,
      Number(dto.page ?? 1),
      Number(dto.limit ?? 20),
    );
  }

  // Hides a csc job from the public job map without touching csc itself.
  @ApiOkResponse({ description: 'Job visibility updated.' })
  @ApiBadRequestResponse({ description: DOC_DESCRIPTION.MUST_BE_MONGOID('jobPostId') })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND('Job post') })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @ApiParam({ name: 'jobPostId' })
  @Patch('csc-jobs/:jobPostId/hidden')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async setCscJobHidden(@ObjectId('jobPostId') jobPostId: string, @Body() dto: SetShopHiddenDto) {
    return this.cscJobsService.setJobPostHidden(jobPostId, dto.hidden);
  }

  /**
   * Drops every cached API response (map markers, lists, option lists) so the next request
   * reads the database. Only response-cache namespaces are cleared - pumpuang sessions, OTPs
   * and locations live in the same redis and must survive.
   */
  @ApiOkResponse({ description: 'Response cache cleared.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Post('clear-response-cache')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @CacheClearKeys(...RESPONSE_CACHE_KEYS)
  @UseInterceptors(CacheClearInterceptor)
  async clearResponseCache(): Promise<{ message: string }> {
    return { message: 'Response cache cleared' };
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
