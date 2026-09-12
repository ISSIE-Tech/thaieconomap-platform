import { SetMetadata } from '@nestjs/common';

import {
  REPONSE_CACHE_NAMESPACE,
  REPONSE_CACHE_QUERY_KEY,
  REPONSE_CLEAR_CACHE_KEYS,
} from '../interceptors';

export const ResponseCacheQueryParam = (...cacheQueryParams: string[]) =>
  SetMetadata(REPONSE_CACHE_QUERY_KEY, cacheQueryParams);

export const CacheClearKeys = (...cacheClearKeys: string[]) =>
  SetMetadata(REPONSE_CLEAR_CACHE_KEYS, cacheClearKeys);

export const ResponseCacheNamespace = (namespace: string) =>
  SetMetadata(REPONSE_CACHE_NAMESPACE, namespace);
