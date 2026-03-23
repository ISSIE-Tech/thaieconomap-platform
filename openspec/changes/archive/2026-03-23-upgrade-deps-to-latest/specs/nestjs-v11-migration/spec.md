## ADDED Requirements

### Requirement: All NestJS packages upgraded to v11
All @nestjs/* packages across backend and gateway apps SHALL be upgraded to ^11.x with consistent versions. No mixed v10/v11 state SHALL remain.

#### Scenario: Backend NestJS packages are v11
- **WHEN** inspecting apps/backend/package.json
- **THEN** all @nestjs/* dependencies (common, core, platform-express, config, jwt, mongoose, passport, swagger, throttler, schedule, cache-manager, axios) SHALL be ^11.x compatible versions

#### Scenario: Gateway NestJS packages are v11
- **WHEN** inspecting apps/gateway/package.json
- **THEN** all @nestjs/* dependencies SHALL be ^11.x compatible versions with no v10 packages remaining

#### Scenario: Dev dependencies aligned
- **WHEN** inspecting devDependencies in both apps
- **THEN** @nestjs/cli, @nestjs/schematics, and @nestjs/testing SHALL be ^11.x

### Requirement: NestJS v11 API changes applied
All deprecated v10 APIs SHALL be replaced with their v11 equivalents. The application SHALL compile and start without deprecation warnings from NestJS.

#### Scenario: Application boots successfully
- **WHEN** running `pnpm --filter backend dev` and `pnpm --filter gateway dev`
- **THEN** both apps SHALL start without NestJS-related errors or deprecation warnings

#### Scenario: All existing tests pass
- **WHEN** running `pnpm --filter backend test` and `pnpm --filter gateway test`
- **THEN** all tests SHALL pass with zero failures

### Requirement: Companion packages compatible with NestJS v11
Packages that depend on NestJS peer dependencies (nestjs-otel, cache-manager-redis-yet) SHALL be upgraded to versions compatible with NestJS v11.

#### Scenario: OpenTelemetry integration works
- **WHEN** the backend starts with OpenTelemetry instrumentation enabled
- **THEN** traces and metrics SHALL be collected without errors

#### Scenario: Redis cache works
- **WHEN** the backend performs cache operations via CacheModule
- **THEN** Redis read/write operations SHALL succeed as before
