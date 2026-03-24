## Why

The OTP request endpoint (`POST /pumpuangs/app/auth/otp/request`) returns a 500 error with `TypeError: store.get is not a function`. This was caused by upgrading `@nestjs/cache-manager` from v2.3.0 to v3.1.0 (commit `bd6a86d`), which switched from the old cache-manager Store interface to Keyv-based stores. The existing `RedisFactory` still returns the old `{ store: RedisStore, ttl }` format from `cache-manager-redis-yet`, which is incompatible with the new API.

## What Changes

- **BREAKING**: Update `RedisFactory` in `redis.handler.ts` to return a Keyv-compatible Redis store instead of the old cache-manager Store format
- Replace `cache-manager-redis-yet` dependency with `@keyv/redis` (Keyv-compatible Redis adapter)
- Update `CacheModule.registerAsync()` configuration in `app.module.ts` to use the new `stores` property instead of `store`
- Verify all cache usage in services (`cacheManager.get`, `.set`, `.del`) works with the updated configuration

## Capabilities

### New Capabilities

_None — this is a bug fix for existing functionality._

### Modified Capabilities

_No spec-level behavior changes — the OTP caching behavior remains the same, only the underlying store adapter changes._

## Impact

- **Dependencies**: Remove `cache-manager-redis-yet`, add `@keyv/redis` (or use Keyv with Redis adapter)
- **Code**: `apps/backend/src/shared/database/redis.handler.ts` (RedisFactory), `apps/backend/src/app.module.ts` (CacheModule config)
- **Services affected**: `PumpuangsService.pumpuangRequestOtp()`, `PumpuangsService.pumpuangVerifyOtp()`, and any other service using `CACHE_MANAGER` injection
- **Runtime**: Redis connection behavior and caching remain functionally identical
