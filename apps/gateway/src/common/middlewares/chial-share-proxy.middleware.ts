import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { globalConfig, servicePath } from '../../shared/constants';

import { ProxyMiddleware } from './proxy.middleware';

@Injectable()
export class ChialShareProxyMiddleware extends ProxyMiddleware {
  constructor(private readonly configService: ConfigService) {
    super(
      {
        target: configService.get(globalConfig.CHIAL_SHARE_API),
        pathRewrite: {
          [servicePath.chialShare]: '',
        },
      },
      configService.get(globalConfig.CHIAL_SHARE_API_KEY),
      configService.get(globalConfig.CHIAL_SHARE_API_SECRET),
    );
  }
}
