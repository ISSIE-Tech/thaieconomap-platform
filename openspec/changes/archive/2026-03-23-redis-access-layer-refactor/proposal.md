## Why

The current Redis access layer has multiple reliability issues:
1. **Version mismatch**: `redis@4.7.1` bundles `@redis/*@1.x` internally, but `@redis/*@5.x` were added as direct deps — causing wrong module versions to load
2. **Fragile client access**: Services cast `cacheManager.store` to `RedisStore` and extract `.client` — this breaks across `cache-manager-redis-yet` versions and during module init
3. **No dedicated Redis module**: The Redis client is obtained indirectly through `CACHE_MANAGER`, mixing caching concerns with direct Redis Stack operations (RediSearch, RedisJSON)
4. **pnpm deploy issues**: Transitive dependencies from `cache-manager-redis-yet` aren't included in `pnpm deploy --legacy`, requiring manual addition of `@redis/*` packages

## What Changes

- Create a dedicated `RedisModule` that provides a properly initialized `RedisClientType` via NestJS DI
- Upgrade `redis` to v5 (aligning `@redis/*` versions) or pin to `redis@4` with correct `@redis/*@1.x`
- Remove the fragile `(cacheManager.store as RedisStore).client` pattern from all services
- Keep `cache-manager` for simple key-value caching, use the dedicated Redis client for RediSearch/RedisJSON
- Remove unnecessary `@redis/*` direct dependencies (they come bundled with `redis`)
- Clean up `redis.handler.ts` factory

## Capabilities

### New Capabilities
- `redis-module`: Dedicated NestJS Redis module providing a typed Redis client with RediSearch and RedisJSON support

### Modified Capabilities

## Impact

- `apps/backend/src/shared/database/redis.handler.ts` — refactored or replaced
- `apps/backend/src/modules/pumpuangs/services/pumpuang.service.ts` — inject Redis client from module
- `apps/backend/src/modules/pumpuangs/services/pending-pumpuangs.service.ts` — inject Redis client from module
- `apps/backend/src/common/guards/pending-pumpuang-session.guard.ts` — inject Redis client from module
- `apps/backend/src/common/interceptors/response-cache.interceptor.ts` — inject Redis client from module
- `apps/backend/src/app.module.ts` — register RedisModule
- `apps/backend/package.json` — clean up Redis-related dependencies
