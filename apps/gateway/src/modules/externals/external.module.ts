import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AuthentikOauthService, FacebookOauthService, LineOauthService } from './services';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [],
  providers: [LineOauthService, FacebookOauthService, AuthentikOauthService],
  exports: [LineOauthService, FacebookOauthService, AuthentikOauthService],
})
export class ExternalModule {}
