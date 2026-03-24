## Context

The backend uses `@nestjs/cache-manager` with Redis for OTP caching. A recent dependency upgrade (commit `bd6a86d`) bumped `@nestjs/cache-manager` from v2.3.0 to v3.1.0, which introduced a breaking change: the module now expects Keyv-based stores instead of the old cache-manager Store interface.

Currently, `RedisFactory` in `redis.handler.ts` returns `{ store: RedisStore, ttl }` using `cache-manager-redis-yet@5.1.5`, which provides the old Store interface. The new `@nestjs/cache-manager@3.1.0` wraps this incorrectly, causing `store.get is not a function` at runtime.

## Goals / Non-Goals

**Goals:**
- Restore OTP request/verify functionality by updating application code to work with `@nestjs/cache-manager@3.1.0`
- Migrate from deprecated `cache-manager-redis-yet` to Keyv-based Redis store (`@keyv/redis`)
- Keep the same Redis connection behavior and caching semantics

**Non-Goals:**
- Changing caching logic or TTL behavior in services
- Modifying the separate `RedisModule` (direct Redis client for JSON commands)

## Decisions

### Decision 1: Migrate to Keyv-based Redis store

**Choice**: Replace `cache-manager-redis-yet` with `@keyv/redis` and update `RedisFactory` to return a Keyv-compatible configuration that `@nestjs/cache-manager@3.1.0` expects.

**Rationale**: `@nestjs/cache-manager@3.1.0` uses `cacheable` (which wraps Keyv) under the hood. The new API expects a `stores` property with `Keyv | KeyvStoreAdapter` instances instead of the old `store` property. `cache-manager-redis-yet` is deprecated and incompatible with this new API.

**What changes in `RedisFactory`**:
- Remove `cache-manager-redis-yet` import
- Use `@keyv/redis` (`KeyvRedis`) to create a Keyv-compatible Redis adapter
- Return `{ stores: [keyvRedisInstance], ttl: ... }` instead of `{ store: redisStore, ttl }`

**Alternatives considered**:
- **Downgrade `@nestjs/cache-manager` to v2.3.0**: Quick fix but leaves deprecated dependencies in place and goes against the upgrade direction.

### Decision 2: Remove `cache-manager-redis-yet` dependency

**Choice**: Remove `cache-manager-redis-yet` from `package.json` and add `@keyv/redis` (plus `cacheable` if needed).

**Rationale**: `cache-manager-redis-yet` is deprecated ("With cache-manager v6 we now are using Keyv"). Keeping it alongside the new setup adds confusion.

## Risks / Trade-offs

- **[Risk] `@keyv/redis` API differs from `cache-manager-redis-yet`** → The Keyv adapter uses a simpler connection string or options object. Verify TLS and password options map correctly.
- **[Risk] TTL handling may differ** → `@nestjs/cache-manager@3.1.0` uses milliseconds for TTL. Verify existing TTL values are in the correct unit.
- **[Risk] pnpm lockfile changes** → Run `pnpm install` after dependency swap.
- **[Trade-off] More code changes than a downgrade** → Worth it to stay on the modern dependency path and avoid future incompatibility.
