import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { GateWayService, TamsangTamsongService, ThaiBulkSmsService } from './services';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [],
  providers: [TamsangTamsongService, GateWayService, ThaiBulkSmsService],
  exports: [TamsangTamsongService, GateWayService, ThaiBulkSmsService],
})
export class ExternalModule {}
