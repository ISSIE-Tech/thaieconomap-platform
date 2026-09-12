import { CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { DistrictResponseDto } from '@thaieconomap/contracts';

import { ResponseCacheNamespace } from '../../common/decorators';
import { ResponseCacheInterceptor } from '../../common/interceptors';
import { CONFIG } from '../../config';
import { CACHE_KEY, DOC_DESCRIPTION } from '../../shared/constants';


import { GetDistrictsFilterDto } from './dto';
import { MapService } from './map.service';
import { DistrictMapper } from './mappers';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: DOC_DESCRIPTION.INVALID_TOKEN })
@Controller('map')
@ResponseCacheNamespace(CACHE_KEY.map.prefix)
@CacheTTL(CONFIG.LONG_TERM_REPONSE_CACHE_TTL)
@UseInterceptors(ResponseCacheInterceptor)
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @ApiOkResponse({ description: 'Return array of district.' })
  @Get('districts')
  async getDistricts(
    @Query() getDistrictsFilterDto: GetDistrictsFilterDto,
  ): Promise<DistrictResponseDto[]> {
    const docs = await this.mapService.getDistricts(getDistrictsFilterDto);

    return docs.map(DistrictMapper.toResponseDto);
  }

  @ApiOkResponse({ description: 'Return array of province.' })
  @Get('provinces')
  async getProvince(): Promise<DistrictResponseDto[]> {
    const docs = await this.mapService.getProvinces();

    return docs.map(DistrictMapper.toResponseDto);
  }
}
