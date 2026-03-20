import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  CommercialResponseDto,
  DeletedCommercialResponseDto,
  PendingCommercialResponseDto,
  UserRole,
} from '@thaieconomap/contracts';

import { CurrentUser, ExcludeRoles } from '../../../common/decorators';
import { AuthGuard, RolesGuard } from '../../../common/guards';
import { TransformFileInterceptor } from '../../../common/interceptors';
import { DOC_DESCRIPTION } from '../../../shared/constants';
import { IAllCommercial, IUser } from '../../../shared/interfaces';
import { CommercialMapper } from '../mappers';
import { AllCommercialsService } from '../services';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
@Controller('all-commercials')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(TransformFileInterceptor)
@ExcludeRoles(UserRole.CUSTOMER)
export class AllCommercialsController {
  constructor(private readonly allCommercialsService: AllCommercialsService) {}

  @ApiOkResponse({ description: 'Return all status of commercial list' })
  @Get()
  async getCommercials(
    @CurrentUser() user: IUser,
  ): Promise<(CommercialResponseDto | PendingCommercialResponseDto | DeletedCommercialResponseDto)[]> {
    const results = await this.allCommercialsService.getAll(user);

    return results.map((doc: IAllCommercial) => {
      if ('deletedBy' in doc) {
        return CommercialMapper.toDeletedResponseDto(doc as any);
      }

      if (!('approvedAt' in doc)) {
        return CommercialMapper.toPendingResponseDto(doc as any);
      }

      return CommercialMapper.toResponseDto(doc as any);
    });
  }
}
