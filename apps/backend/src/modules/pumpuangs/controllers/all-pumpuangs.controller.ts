import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import {
  DeletedPumpuangResponseDto,
  PendingPumpuangResponseDto,
  PumpuangResponseDto,
  UserRole,
} from '@thaieconomap/contracts';

import { CurrentUser, ExcludeRoles } from '../../../common/decorators';
import { AuthGuard, RolesGuard } from '../../../common/guards';
import { TransformFileInterceptor } from '../../../common/interceptors';
import { DOC_DESCRIPTION } from '../../../shared/constants';
import { IAllPumpuang, IUser } from '../../../shared/interfaces';
import { PumpuangMapper } from '../mappers';
import { AllPumpuangsService } from '../services/all-pumpuang.service';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@ApiForbiddenResponse({ description: DOC_DESCRIPTION.EXCLUDE_ROLES(UserRole.CUSTOMER) })
@Controller('all-pumpuangs')
@UseGuards(AuthGuard)
@ExcludeRoles(UserRole.CUSTOMER)
export class AllPumpuangsController {
  constructor(private readonly allPumpuangsService: AllPumpuangsService) {}

  @Get()
  @UseInterceptors(TransformFileInterceptor)
  @UseGuards(RolesGuard)
  async getPumpuangs(
    @CurrentUser() user: IUser,
  ): Promise<(PumpuangResponseDto | PendingPumpuangResponseDto | DeletedPumpuangResponseDto)[]> {
    const results = await this.allPumpuangsService.getAll(user);

    return results.map((doc: IAllPumpuang) => {
      if ('deletedBy' in doc) {
        return PumpuangMapper.toDeletedResponseDto(doc as any);
      }

      if (!('approvedAt' in doc)) {
        return PumpuangMapper.toPendingResponseDto(doc as any);
      }

      return PumpuangMapper.toResponseDto(doc as any);
    });
  }
}
