## Why

The current MongoDB/Mongoose stack lacks strong typing at the data access layer, has loosely-typed service methods (many return `any` or raw Mongoose documents), and makes schema evolution error-prone. Migrating to PostgreSQL with Prisma ORM provides auto-generated types from the schema, enforced relational integrity, and a type-safe query API. This also enables proper request/response DTOs integrated with Swagger OpenAPI for guaranteed backward-compatible API contracts, strongly-typed repository inputs using Prisma generated types, and explicit `Promise<T>` return types across all services and controllers.

## What Changes

- **BREAKING** Replace MongoDB/Mongoose with PostgreSQL/Prisma as the database layer
- **BREAKING** Replace all Mongoose schemas with a Prisma schema defining relational models
- Add request DTOs and response DTOs for every endpoint, integrated with `@nestjs/swagger` decorators for OpenAPI documentation
- Refactor all repository classes to accept Prisma-generated input types (`Prisma.XxxCreateInput`, `Prisma.XxxUpdateInput`, `Prisma.XxxWhereInput`) instead of raw objects
- Add explicit `Promise<ResponseDto>` return types to every service method and controller handler
- Replace Mongoose aggregation pipelines with Prisma queries (joins, includes, raw SQL where needed)
- Replace GeoJSON/2dsphere indexes with PostGIS extensions for geospatial queries
- Replace MongoDB TTL indexes with PostgreSQL-based scheduled cleanup (e.g., `pg_cron` or application-level scheduled tasks)
- Replace Mongoose schema inheritance (Pending → Approved → Deleted) with a single table per entity using status columns or Prisma model composition
- Replace polymorphic `typeRefPath` references with explicit relational foreign keys
- Replace Mongoose virtual fields with Prisma computed fields or application-level getters
- Create database migration scripts for initial schema setup and data migration from MongoDB to PostgreSQL
- Maintain full backward compatibility on all REST API endpoints (same paths, same request/response shapes)

## Capabilities

### New Capabilities

- `prisma-schema`: Prisma schema definition mapping all MongoDB collections to PostgreSQL tables with proper relations, indexes, enums, and PostGIS support
- `request-response-dtos`: Typed request DTOs (input validation) and response DTOs (output serialization) for every endpoint, with full Swagger/OpenAPI decorators
- `typed-repository-layer`: Repository interfaces and implementations using Prisma-generated types for all inputs, outputs, and query filters
- `typed-service-layer`: All service methods and controller handlers with explicit `Promise<T>` return types using response DTOs or Prisma-generated types
- `database-migration`: Migration scripts covering Prisma schema migrations (DDL) and data migration from MongoDB to PostgreSQL (ETL)

### Modified Capabilities

_(No existing specs to modify)_

## Impact

- **Dependencies**: Remove `mongoose`, `@nestjs/mongoose`. Add `@prisma/client`, `prisma`, `@nestjs/swagger` types. Potentially add PostGIS extensions.
- **Database**: New PostgreSQL instance required. MongoDB retained temporarily for data migration.
- **All modules affected**: `commercials`, `pumpuangs`, `shares`, `announcements`, `users`, `map` — every schema, repository, service, and controller will be rewritten.
- **Shared layer**: `EntityRepository` base class replaced with Prisma-based repository pattern. Pagination, filtering, and sorting utilities rewritten for Prisma.
- **API surface**: All REST endpoints maintain identical paths, methods, and request/response shapes for backward compatibility. Swagger docs updated with explicit DTO types.
- **Caching**: Redis caching layer remains but cache key strategies may change with new ID format (UUID vs ObjectId).
- **Auth**: JWT and OTP flows unchanged in behavior, but underlying queries migrate to Prisma.
- **Geospatial**: PostGIS replaces MongoDB 2dsphere for location queries (nearby search, map display).
- **CI/CD**: Pipeline needs PostgreSQL service for tests. Docker compose updated.
- **Real-time tracking**: Pumpuang GPS tracking data model adapts from nested arrays to relational tables.
