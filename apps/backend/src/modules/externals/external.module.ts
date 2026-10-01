import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import {
  ChialShareService,
  GateWayService,
  TamsangTamsongService,
  ThaiBulkSmsService,
} from './services';

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
  providers: [ChialShareService, TamsangTamsongService, GateWayService, ThaiBulkSmsService],
  exports: [ChialShareService, TamsangTamsongService, GateWayService, ThaiBulkSmsService],
})
export class ExternalModule {}
