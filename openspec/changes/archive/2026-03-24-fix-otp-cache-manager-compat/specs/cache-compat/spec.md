## ADDED Requirements

### Requirement: Cache manager store compatibility

The `CacheModule` registration SHALL use a Redis store adapter compatible with the installed `@nestjs/cache-manager` version. The `RedisFactory` SHALL return a configuration object that the `CacheModule` accepts without runtime errors.

#### Scenario: OTP request uses cache successfully
- **WHEN** a user requests an OTP via `POST /pumpuangs/app/auth/otp/request`
- **THEN** the system SHALL store the OTP in Redis cache and return a success response (no 500 error)

#### Scenario: OTP verify reads cache successfully
- **WHEN** a user verifies an OTP via the verify endpoint after requesting one
- **THEN** the system SHALL retrieve the cached OTP from Redis and validate it

#### Scenario: Cache get/set/del operations work
- **WHEN** any service calls `cacheManager.get()`, `cacheManager.set()`, or `cacheManager.del()`
- **THEN** the operations SHALL execute without `TypeError: store.get is not a function`
