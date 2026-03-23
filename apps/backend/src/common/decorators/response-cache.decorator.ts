import { SetMetadata } from '@nestjs/common';

import {
  REPONSE_CACHE_NAMESPACE,
  REPONSE_CACHE_QUERY_KEY,
  REPONSE_CACHE_TTL,
  REPONSE_CLEAR_CACHE_KEYS,
} from '../interceptors';

export const ResponseCacheQueryParam = (...cacheQueryParams: string[]) =>
  SetMetadata(REPONSE_CACHE_QUERY_KEY, cacheQueryParams);

export const CacheClearKeys = (...cacheClearKeys: string[]) =>
  SetMetadata(REPONSE_CLEAR_CACHE_KEYS, cacheClearKeys);

export const ResponseCacheTTL = (ttl: number) => SetMetadata(REPONSE_CACHE_TTL, ttl);

export function ResponseCacheNamespace(namespace: string): ClassDecorator {
  return function (target: object) {
    for (const key of Object.getOwnPropertyNames((target as any).prototype)) {
      const method = (target as any).prototype[key];

      if (typeof method === 'function' && key !== 'constructor') {
        Reflect.defineMetadata(REPONSE_CACHE_NAMESPACE, namespace, method);
      }
    }
  };
}

export function GlobalResponseCacheTTL(ttl: number): ClassDecorator {
  return function (target: object) {
    for (const key of Object.getOwnPropertyNames((target as any).prototype)) {
      const method = (target as any).prototype[key];

      if (typeof method === 'function' && key !== 'constructor') {
        Reflect.defineMetadata(REPONSE_CACHE_TTL, ttl, method);
      }
    }
  };
}
