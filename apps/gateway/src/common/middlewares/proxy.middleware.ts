import { ClientRequest } from 'http';

import { Request } from 'express';
import { RequestHandler, createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

import { generateHmacSha256Hash } from '../../shared/utils';

export const serviceProxy = (
  target: string,
  prefix: string,
  apiKey: string,
  apiSecret: string,
): RequestHandler =>
  createProxyMiddleware({
    target,
    pathRewrite: { [prefix]: '' },
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq: ClientRequest, req: Request) => {
        proxyReq.setHeader('api-key', generateHmacSha256Hash(apiKey, apiSecret));

        if (req.user) {
          const { refreshToken, oauth, ...user } = req.user;

          proxyReq.setHeader('user', encodeURIComponent(JSON.stringify(user)));
        }

        fixRequestBody(proxyReq, req);
      },
    },
  });
