import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { globalConfig, servicePath } from '../../shared/constants';

import { ProxyMiddleware } from './proxy.middleware';

@Injectable()
export class ThaiEconomapProxyMiddleware extends ProxyMiddleware {
  constructor(private readonly configService: ConfigService) {
    super(
      {
        target: configService.get(globalConfig.THAIECONOMAP_API),
        pathRewrite: {
          [servicePath.thaiEconomap]: '',
        },
      },
      configService.get(globalConfig.THAIECONOMAP_API_KEY),
      configService.get(globalConfig.THAIECONOMAP_API_SECRET),
    );
  }
}
