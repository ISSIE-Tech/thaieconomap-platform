import { Module } from '@nestjs/common';

import { MinioClientModule } from '../minio-client/minio-client.module';

import { AdditionalImageService } from './additional-image.service';

@Module({
  imports: [MinioClientModule],
  providers: [AdditionalImageService],
  exports: [AdditionalImageService],
})
export class AdditionalImageModule {}
