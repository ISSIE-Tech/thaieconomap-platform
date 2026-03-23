## ADDED Requirements

### Requirement: RedisModule provides a connected Redis client
The `RedisModule` SHALL create a Redis client using `redis.createClient()` directly, connect it during module initialization, and provide it via `REDIS_CLIENT` injection token.

#### Scenario: Client is available at injection time
- **WHEN** a service injects `@Inject(REDIS_CLIENT) redisClient`
- **THEN** the client is connected and ready with `.ft` and `.json` commands available

#### Scenario: Client connects using environment config
- **WHEN** the RedisModule initializes
- **THEN** it reads host, port, password, and TLS settings from `ConfigService`

### Requirement: RedisModule handles connection errors gracefully
The module SHALL log connection events and implement automatic reconnection.

#### Scenario: Redis connection drops
- **WHEN** the Redis connection is lost
- **THEN** the module logs the error and attempts to reconnect

#### Scenario: Redis is unavailable at startup
- **WHEN** Redis is not reachable during module init
- **THEN** the module logs an error but does not crash the application

### Requirement: Services use REDIS_CLIENT instead of cache-manager store
All services that need RediSearch or RedisJSON SHALL inject `REDIS_CLIENT` instead of extracting the client from `CACHE_MANAGER`.

#### Scenario: PumpuangsService uses injected client
- **WHEN** `PumpuangsService` needs to call `.ft.search()` or `.json.get()`
- **THEN** it uses the injected `REDIS_CLIENT`, not `cacheManager.store.client`

#### Scenario: PendingPumpuangsService uses injected client
- **WHEN** `PendingPumpuangsService` creates search indexes on init
- **THEN** it uses the injected `REDIS_CLIENT`

### Requirement: Redis dependency versions are consistent
The `redis` package version SHALL be pinned to `4.7.x` and all `@redis/*` direct dependencies SHALL be removed (they are bundled with `redis@4`).

#### Scenario: No version conflict in deployed container
- **WHEN** the backend is built with `pnpm deploy --legacy`
- **THEN** the Redis client in the container has `.ft` and `.json` commands available
