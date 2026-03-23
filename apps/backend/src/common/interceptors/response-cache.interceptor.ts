import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { HttpMethod } from '@thaieconomap/contracts';
import { RedisCache } from 'cache-manager-redis-yet';
import { Request } from 'express';
import { RedisClientType } from 'redis';
import { Observable, tap } from 'rxjs';

import { REDIS_CLIENT } from '../../shared/redis';


export const REPONSE_CACHE_QUERY_KEY: string = 'REPONSE_CACHE_QUERY_KEY';

export const REPONSE_CLEAR_CACHE_KEYS: string = 'REPONSE_CLEAR_CACHE_KEYS';

export const REPONSE_CACHE_TTL: string = 'cache_module:cache_ttl';

export const REPONSE_CACHE_NAMESPACE: string = 'REPONSE_CACHE_NAMESPACE';

@Injectable()
export class ResponseCacheInterceptor extends CacheInterceptor {
  constructor(
    protected readonly cacheManager: RedisCache,
    protected readonly reflector: Reflector,
  ) {
    super(cacheManager, reflector);
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    try {
      return await super.intercept(context, next);
    } catch (_error) {
      // log here

      return next.handle();
    }
  }

  protected trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const { query, method, route } = request;
    const isQueryEmpty = !Object.keys(query).length;
    const namespace = this.getReponseCacheNamespace(context);
    const cacheKey = `${namespace}:${route.path}`;

    // Ensure this interceptor only applies to GET requests
    if (method !== HttpMethod.GET) {
      return undefined;
    }

    // Define the specific query parameters to include in the cache key
    const cacheKeyParams = this.getResponseCacheQueryKey(context);

    if (isQueryEmpty || !cacheKeyParams.length) {
      return cacheKey;
    }

    const cacheAttribute = [];
    const acceptKeyQuerySet = new Set();
    const acceptQuery = new Map<string, string>();
    const queryKey = Object.keys(query).sort();

    cacheKeyParams.forEach(inp => {
      const [key, value] = inp.split('=', 2);

      acceptQuery.set(key, value);
      acceptKeyQuerySet.add(key);
    });

    const isValidQuery = !queryKey.filter(key => {
      const acceptKey = acceptKeyQuerySet.has(key) && acceptQuery.get(key) === undefined;
      const acceptValue = acceptQuery.get(key) == query[key];

      cacheAttribute.push(`${key}=${query[key]}`);

      return !(acceptKey || acceptValue);
    }).length;

    return isValidQuery ? `${cacheKey}:${cacheAttribute.join('|')}` : undefined;
  }

  private getResponseCacheQueryKey(context: ExecutionContext): string[] {
    const handler = context.getHandler();
    const metadata = this.reflector.get(REPONSE_CACHE_QUERY_KEY, handler);

    return metadata || [];
  }

  private getReponseCacheNamespace(context: ExecutionContext): string[] {
    const handler = context.getHandler();
    const metadata = this.reflector.get(REPONSE_CACHE_NAMESPACE, handler);

    return metadata || 'cache';
  }
}

@Injectable()
export class CacheClearInterceptor implements NestInterceptor {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClientType,

    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const cacheKeys = this.getCacheKey(context);

    return next.handle().pipe(
      tap(async () => {
        if (cacheKeys.length) {
          const existsKeys = (
            await Promise.all(cacheKeys.map((key: string) => this.redisClient.keys(key)))
          ).flat();

          if (existsKeys.length) {
            await this.redisClient.del(existsKeys);
          }
        }
      }),
    );
  }

  private getCacheKey(context: ExecutionContext): string[] {
    const handler = context.getHandler();
    const metadata = this.reflector.get(REPONSE_CLEAR_CACHE_KEYS, handler);

    return metadata || [];
  }
}
