import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { LocationDto } from '../../shared/dto';

import { BaseRepository } from './repositories';

// Public: the map asks whether tamsang-tamsong serves where the user is standing.
@Controller('bases')
export class BasesController {
  constructor(private readonly baseRepository: BaseRepository) {}

  @ApiOkResponse({ description: 'The tamsang-tamsong node serving this point, or null.' })
  @Get('serving')
  async findServing(@Query() { latitude, longitude }: LocationDto) {
    const base = await this.baseRepository.findServing(latitude, longitude);

    return { base: base && { name: base.name ?? null, basicId: base.botInfo.basicId } };
  }
}
