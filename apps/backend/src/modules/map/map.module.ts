import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DistrictsRepository } from './districts.repository';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { District, DistrictSchema } from './schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: District.name, schema: DistrictSchema }])],
  controllers: [MapController],
  providers: [MapService, DistrictsRepository],
  exports: [MapService],
})
export class MapModule {}
