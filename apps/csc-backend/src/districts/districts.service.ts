import { Injectable } from '@nestjs/common';
import { District, DistrictDocument } from './district.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GetDistrictsFilterDto } from './dtos/get-districts-filter.dto';
import { CreateDistrictDto } from './dtos/create-district.dto';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectModel(District.name)
    private readonly districtModel: Model<DistrictDocument>,
  ) {}

  async getDistricts(getDistrictsFilterDto: GetDistrictsFilterDto) {
    const { searchTerm } = getDistrictsFilterDto;

    delete getDistrictsFilterDto['searchTerm'];

    const query = { ...getDistrictsFilterDto };
    if (searchTerm) {
      query['districtName'] = {
        $regex: searchTerm,
      };
    }

    return await this.districtModel.find(query, {
      __v: 0,
    });
  }

  async createDistrict(createDistrictDto: CreateDistrictDto) {
    const district = new this.districtModel(createDistrictDto);
    await district.save();
  }
}
