## 1. Fix Dependencies

- [x] 1.1 Remove direct `@redis/*` packages from `apps/backend/package.json` (@redis/bloom, @redis/client, @redis/graph, @redis/json, @redis/search, @redis/time-series)
- [x] 1.2 Pin `redis` to `^4.7.1` (keep current version, ensure it bundles its own @redis/* modules)
- [x] 1.3 Run `pnpm install` and verify lockfile

## 2. Create RedisModule

- [x] 2.1 Create `apps/backend/src/shared/redis/redis.constants.ts` with `REDIS_CLIENT` injection token
- [x] 2.2 Create `apps/backend/src/shared/redis/redis.module.ts` — async module that creates and connects a `redis.createClient()` with config from `ConfigService`, provides `REDIS_CLIENT`
- [x] 2.3 Create `apps/backend/src/shared/redis/index.ts` barrel export
- [x] 2.4 Register `RedisModule` in `app.module.ts`

## 3. Migrate Services to Use REDIS_CLIENT

- [x] 3.1 Update `pumpuang.service.ts` — replace `cacheManager.store` cast with `@Inject(REDIS_CLIENT)`, remove `redisClient` init from `onModuleInit`
- [x] 3.2 Update `pending-pumpuangs.service.ts` — same migration
- [x] 3.3 Update `pending-pumpuang-session.guard.ts` — same migration, remove lazy init
- [x] 3.4 Update `response-cache.interceptor.ts` — inject `REDIS_CLIENT` if it uses direct client, or keep cache-manager if only using cache API
- [x] 3.5 Import `RedisModule` in `PumpuangsModule` and any other modules that need it (RedisModule is @Global, no per-module import needed)

## 4. Clean Up

- [x] 4.1 Remove `RedisStore` import from `cache-manager-redis-yet` in migrated files
- [x] 4.2 Simplify `redis.handler.ts` — remove `.client` access, keep only cache-manager factory logic
- [x] 4.3 Remove unused `RedisClientType` import from `redis` in migrated files (now comes from module)

## 5. Verify

- [x] 5.1 Build backend locally (`pnpm --filter thaieconomap-backend build`)
- [x] 5.2 Build Docker image and verify Redis modules are available in container
- [x] 5.3 Test that `.ft` and `.json` commands work in the container
