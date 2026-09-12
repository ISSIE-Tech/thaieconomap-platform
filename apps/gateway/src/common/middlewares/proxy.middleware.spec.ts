import { createServer, get, IncomingHttpHeaders, Server } from 'http';
import { AddressInfo } from 'net';

import * as express from 'express';

import { generateHmacSha256Hash } from '../../shared/utils';

import { serviceProxy } from './proxy.middleware';

const listen = (server: Server) =>
  new Promise<number>(r => server.listen(0, () => r((server.address() as AddressInfo).port)));

const getText = (url: string) =>
  new Promise<string>((resolve, reject) =>
    get(url, res => {
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => resolve(body));
    }).on('error', reject),
  );

describe('serviceProxy', () => {
  let upstream: Server;
  let gateway: Server;
  let gatewayPort: number;
  let seen: { url?: string; headers?: IncomingHttpHeaders } = {};

  beforeAll(async () => {
    upstream = createServer((req, res) => {
      seen = { url: req.url, headers: req.headers };
      res.end('ok');
    });
    const upstreamPort = await listen(upstream);

    const app = express();
    app.use((req, _res, next) => {
      (req as any).user = { name: 'u', refreshToken: 'secret-token', oauth: { id: 1 } };
      next();
    });
    app.use(serviceProxy(`http://127.0.0.1:${upstreamPort}`, '/services/x', 'key', 'secret'));
    gateway = createServer(app);
    gatewayPort = await listen(gateway);
  });

  afterAll(() => {
    upstream.close();
    gateway.close();
  });

  it('strips the prefix, signs the api key and forwards the user without secrets', async () => {
    expect(await getText(`http://127.0.0.1:${gatewayPort}/services/x/items?a=1`)).toBe('ok');
    expect(seen.url).toBe('/items?a=1');
    expect(seen.headers['api-key']).toBe(generateHmacSha256Hash('key', 'secret'));
    expect(JSON.parse(decodeURIComponent(seen.headers['user'] as string))).toEqual({ name: 'u' });
  });
});
