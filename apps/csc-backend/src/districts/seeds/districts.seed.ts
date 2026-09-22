import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { DistrictsService } from 'src/districts/districts.service';

interface District {
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtType: string;
  districtName: string;
  latitude: number;
  longitude: number;
}

@Injectable()
export class DistrictsSeed {
  constructor(private readonly disctrictsService: DistrictsService) {}

  @Command({ command: 'insert:districts', describe: 'insert districts' })
  async insert() {
    const _data = await fs.readFile(
      './backup/districts-position.json',
      'utf-8',
    );
    const districts: District[] = JSON.parse(_data);

    for (const district of districts) {
      await this.disctrictsService.createDistrict(district);
    }
    console.log('insert districts successfully');
  }
}
