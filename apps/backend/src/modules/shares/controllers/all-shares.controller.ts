import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  DeletedShareResponseDto,
  PendingShareResponseDto,
  ShareResponseDto,
  UserRole,
} from '@thaieconomap/contracts';

import { CurrentUser, ExcludeRoles } from '../../../common/decorators';
import { AuthGuard, RolesGuard } from '../../../common/guards';
import { TransformFileInterceptor } from '../../../common/interceptors';
import { DOC_DESCRIPTION } from '../../../shared/constants';
import { IAllShare, IUser } from '../../../shared/interfaces';
import { ShareMapper } from '../mappers';
import { AllSharesService } from '../services';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
@Controller('all-shares')
@UseGuards(AuthGuard)
@ExcludeRoles(UserRole.CUSTOMER)
@UseInterceptors(TransformFileInterceptor)
export class AllSharesController {
  constructor(private readonly allSharesService: AllSharesService) {}

  @ApiOkResponse({ description: 'Return all status of share list' })
  @Get()
  @UseGuards(RolesGuard)
  async getShares(
    @CurrentUser() user: IUser,
  ): Promise<(ShareResponseDto | PendingShareResponseDto | DeletedShareResponseDto)[]> {
    const results = await this.allSharesService.getAll(user);

    return results.map((doc: IAllShare) => {
      if ('deletedBy' in doc) {
        return ShareMapper.toDeletedResponseDto(doc as any);
      }

      if (!('approvedAt' in doc)) {
        return ShareMapper.toPendingResponseDto(doc as any);
      }

      return ShareMapper.toResponseDto(doc as any);
    });
  }
}
