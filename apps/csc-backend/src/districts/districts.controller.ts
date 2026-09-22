import { Controller, Get, Query } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { GetDistrictsFilterDto } from './dtos/get-districts-filter.dto';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get()
  async getDistricts(@Query() getDistrictsFilterDto: GetDistrictsFilterDto) {
    const districts = await this.districtsService.getDistricts(
      getDistrictsFilterDto,
    );
    return {
      statusCode: 200,
      message: 'get districts successfully',
      districts,
    };
  }
}
