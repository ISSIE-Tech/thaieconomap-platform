import { ClientRequest } from 'http';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import { Options, createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

import { generateHmacSha256Hash } from '../../shared/utils';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(
    private readonly options: Options,
    private readonly apiKey: string,
    private readonly apiSecret: string,
  ) {}

  private proxy = createProxyMiddleware({
    ...this.options,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq: ClientRequest, req: Request) => {
        const hashedApiKey = generateHmacSha256Hash(this.apiKey, this.apiSecret);

        proxyReq.setHeader('api-key', hashedApiKey);

        if (req.user) {
          const { refreshToken, oauth, ...user } = req?.user || {};
          const encodedUser = encodeURIComponent(JSON.stringify(user));

          proxyReq.setHeader('user', encodedUser);
        }

        fixRequestBody(proxyReq, req);
      },
    },
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.proxy(req, res, next);
  }
}
