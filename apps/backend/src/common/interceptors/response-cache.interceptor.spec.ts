import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ResponseCacheNamespace } from '../decorators/response-cache.decorator';

import { REPONSE_CACHE_NAMESPACE, ResponseCacheInterceptor } from './response-cache.interceptor';

const contextFor = (controller: new () => { list: () => void }): ExecutionContext =>
  ({
    getHandler: () => controller.prototype.list,
    getClass: () => controller,
    switchToHttp: () => ({ getRequest: () => ({ method: 'GET', query: {}, route: { path: '/items' } }) }),
  }) as unknown as ExecutionContext;

describe('ResponseCacheInterceptor.trackBy', () => {
  const interceptor = new ResponseCacheInterceptor({} as never, new Reflector());
  const trackBy = (controller: new () => { list: () => void }) =>
    (interceptor as unknown as { trackBy: (c: ExecutionContext) => string }).trackBy(contextFor(controller));

  it('keys by the @ResponseCacheNamespace on the controller', () => {
    @ResponseCacheNamespace('commercials')
    class Controller {
      list() {}
    }

    expect(trackBy(Controller)).toBe('commercials:/items');
  });

  it('reads namespace metadata set on the class itself', () => {
    @SetMetadata(REPONSE_CACHE_NAMESPACE, 'raw')
    class Controller {
      list() {}
    }

    expect(trackBy(Controller)).toBe('raw:/items');
  });

  it('falls back to the "cache" namespace', () => {
    class Controller {
      list() {}
    }

    expect(trackBy(Controller)).toBe('cache:/items');
  });
});
