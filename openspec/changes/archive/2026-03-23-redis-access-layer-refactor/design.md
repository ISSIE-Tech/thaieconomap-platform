## Context

The backend uses Redis Stack (redis/redis-stack-server) for three purposes:
1. **Simple caching** via `@nestjs/cache-manager` + `cache-manager-redis-yet` (get/set/del)
2. **RediSearch** (`.ft.*`) for creating indexes and searching pumpuang locations/sessions
3. **RedisJSON** (`.json.*`) for storing structured pumpuang location/session data

Currently, all three go through the cache-manager's store client, extracted via unsafe casting. This creates a fragile dependency chain: `CACHE_MANAGER → store → client → .ft/.json`.

## Goals / Non-Goals

**Goals:**
- Provide a reliable, typed Redis client for RediSearch/RedisJSON operations
- Decouple direct Redis operations from the caching layer
- Fix the version mismatch between `redis@4` and `@redis/*@5`
- Ensure the Redis client is available before services that depend on it initialize

**Non-Goals:**
- Replacing `@nestjs/cache-manager` for simple caching (it works fine for that)
- Migrating away from Redis Stack features (RediSearch/RedisJSON are needed)
- Changing the Redis server deployment (redis-stack-server stays)

## Decisions

### 1. Create a dedicated `RedisModule` with `REDIS_CLIENT` injection token

A custom NestJS module that:
- Creates a `redis.createClient()` directly (not through cache-manager)
- Connects on module init
- Provides the client via `@Inject(REDIS_CLIENT)`
- Handles reconnection/error logging

This separates concerns: `CACHE_MANAGER` for simple caching, `REDIS_CLIENT` for RediSearch/RedisJSON.

Alternative: Upgrade `cache-manager-redis-yet` and keep extracting `.client` — rejected because it's the same fragile pattern.

### 2. Pin `redis@4.7.x` and remove direct `@redis/*` dependencies

`redis@4` bundles compatible `@redis/*@1.x` internally. The manually added `@redis/*@5.x` packages conflict. Pin `redis@4.7.x` and remove the `@redis/*` direct deps — they'll come from the `redis` package itself.

Alternative: Upgrade to `redis@5` — rejected because `cache-manager-redis-yet@5` requires `redis@4`. Would need to also replace the cache layer.

### 3. Services inject `REDIS_CLIENT` instead of casting from cache-manager

Replace:
```typescript
this.redisClient = (this.cacheManager.store as RedisStore).client;
```
With:
```typescript
constructor(@Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType) {}
```

This eliminates timing issues (client is guaranteed connected before injection) and type casting.

## Risks / Trade-offs

- **Two Redis connections** — One from cache-manager, one from RedisModule. Acceptable since Redis handles many concurrent connections efficiently. → Monitor connection count if needed.
- **Migration effort** — Need to update 4 files that use the direct client. → Small, well-scoped change.
