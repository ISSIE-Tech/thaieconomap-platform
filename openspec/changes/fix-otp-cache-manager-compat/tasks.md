## 1. Dependency Changes

- [x] 1.1 Remove `cache-manager-redis-yet` from `apps/backend/package.json`
- [x] 1.2 Add `@keyv/redis` and `cacheable` to `apps/backend/package.json`
- [x] 1.3 Run `pnpm install` to update the lockfile

## 2. Update RedisFactory

- [x] 2.1 Rewrite `apps/backend/src/shared/database/redis.handler.ts` to use `@keyv/redis` (KeyvRedis) instead of `cache-manager-redis-yet`, returning a config object with `stores` property compatible with `@nestjs/cache-manager@3.1.0`
- [x] 2.2 Update the return type of `RedisFactory` to match the new configuration shape

## 3. Update CacheModule Registration

- [x] 3.1 Verify `CacheModule.registerAsync()` in `app.module.ts` works with the new `RedisFactory` return shape (update if needed)

## 4. Verify Cache Usage in Services

- [x] 4.1 Verify `cacheManager.get()`, `.set()`, `.del()` calls in `PumpuangsService` (and other services) are compatible with the new cache manager API
- [x] 4.2 Check TTL units — `@nestjs/cache-manager@3.1.0` may expect milliseconds vs seconds

## 5. Build and Test

- [x] 5.1 Build the backend (`pnpm build`) and confirm no type errors
- [ ] 5.2 Test OTP request endpoint works without `store.get is not a function` error
