import { Controller, Delete, Get, Injectable, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle, minutes } from '@nestjs/throttler';

import { UserRole } from '@thaieconomap/contracts';

import { CacheClearKeys, Roles } from './common/decorators';
import { AuthGuard, ProxiedThrottlerGuard, RolesGuard } from './common/guards';
import { CacheClearInterceptor } from './common/interceptors';
import { DOC_DESCRIPTION } from './shared/constants';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Injectable()
@Controller()
export class AppController {
  constructor() {}

  @ApiOkResponse({ description: 'Cache cleared.' })
  @ApiForbiddenResponse({ description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN) })
  @Delete('clear-caching')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(CacheClearInterceptor)
  @CacheClearKeys('*')
  async clearAllCaching(): Promise<void> {}

  @ApiOkResponse({ description: 'Server running.' })
  @ApiBadGatewayResponse({ description: 'Server down' })
  @Get('health')
  @UseGuards(ProxiedThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: minutes(5) } })
  async healthCheck(): Promise<void> {}
}
