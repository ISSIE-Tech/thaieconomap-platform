## Context

The ThaiEconoMap backend is a NestJS application using MongoDB/Mongoose with ~20 repositories across 6 modules (commercials, pumpuangs, shares, announcements, users, map). The current architecture uses:

- Mongoose schema inheritance chains (PendingCommercial → Commercial → DeletedCommercial) stored in **separate collections**
- A generic `EntityRepository<T extends Document>` base class wrapping Mongoose operations with `unknown` inputs
- Polymorphic references via `typeRefPath` (commercials → BusinessType | RestaurantType)
- GeoJSON with 2dsphere indexes for location-based queries
- MongoDB TTL indexes for auto-deletion of rejected/deleted records
- Mongoose virtual fields for computed properties (e.g., announcement `isAvailable`, `status`)
- Complex aggregation pipelines (`$unionWith` for merging shops + commercials)
- Services and controllers with loose/implicit return types

The API serves a mobile app and admin dashboard. All existing REST endpoints must remain backward-compatible.

## Goals / Non-Goals

**Goals:**

- Replace MongoDB/Mongoose with PostgreSQL/Prisma across all modules
- Achieve full type safety from database to API response using Prisma-generated types
- Create request DTOs (validation) and response DTOs (serialization) for every endpoint with Swagger decorators
- Repository layer accepts only Prisma-generated input types (`Prisma.XxxCreateInput`, `Prisma.XxxWhereInput`, etc.)
- All service methods and controller handlers declare explicit `Promise<ResponseDto>` return types
- Maintain backward-compatible API responses (same JSON shapes, same endpoint paths)
- Create migration scripts: Prisma schema migrations (DDL) + MongoDB-to-PostgreSQL data ETL
- Support geospatial queries via PostGIS

**Non-Goals:**

- Changing any REST API endpoint paths or HTTP methods
- Modifying the authentication/authorization flow (JWT, OTP mechanisms stay the same)
- Rewriting the Redis caching layer (stays as-is, only cache keys may change)
- Modifying the MinIO/S3 file upload pipeline
- Adding new features or endpoints beyond what exists today
- Real-time WebSocket changes (pumpuang tracking protocol stays the same)

## Decisions

### D1: Single-table design with status enum instead of inheritance chains

**Decision:** Collapse Mongoose inheritance chains (Pending → Approved → Deleted stored in 3 separate collections) into a single PostgreSQL table per entity with a `lifecycleStatus` enum column (`PENDING`, `APPROVED`, `DELETED`).

**Rationale:** PostgreSQL doesn't have Mongoose-style discriminator inheritance across tables. A single table with a status column is simpler, avoids data duplication, and makes queries more efficient (no cross-table moves on approval/deletion). Approval/deletion metadata (`approvedAt`, `approvedBy`, `deletedAt`, `deletedBy`) become nullable columns populated when status transitions.

**Alternative considered:** Separate tables per lifecycle stage with foreign keys — rejected because it requires copying rows between tables on status transitions (same as current MongoDB approach), adding complexity with no benefit.

### D2: Explicit relational foreign keys instead of polymorphic `typeRefPath`

**Decision:** Replace the polymorphic `typeRefPath` pattern with two explicit nullable relation arrays: `businessTypes BusinessType[]` and `restaurantTypes RestaurantType[]` on the Commercial model. The `category` enum (`RESTAURANT` | `BUSINESS`) determines which relation is active.

**Rationale:** Prisma doesn't support MongoDB-style `refPath` polymorphism. Explicit relations give type safety at the schema level and enable Prisma `include` for eager loading. The `category` column already discriminates which type applies, making this a clean mapping.

**Alternative considered:** A single `CommercialType` table with a `kind` discriminator — rejected because business types and restaurant types are separate domain concepts with independent CRUD endpoints.

### D3: UUID primary keys

**Decision:** Use `String @id @default(uuid())` for all primary keys instead of auto-increment integers.

**Rationale:** UUIDs avoid ID conflicts during migration from MongoDB ObjectIds, are safe for distributed systems, and don't leak ordering information. The API currently returns ObjectId strings — switching to UUID strings maintains backward compatibility in JSON responses. The `_id` field in responses will be mapped to `id` in Prisma, but response DTOs will serialize as `_id` for backward compatibility.

**Alternative considered:** Auto-increment integers — rejected because they'd break existing client integrations expecting string IDs, and would require maintaining an ObjectId→int mapping during migration.

### D4: PostGIS for geospatial queries

**Decision:** Use the PostGIS extension with Prisma's `Unsupported("geometry(Point, 4326)")` type for location fields. Geospatial queries (nearby search, bounding box) will use raw SQL via `prisma.$queryRaw` with PostGIS functions (`ST_DWithin`, `ST_Distance`, `ST_MakePoint`).

**Rationale:** PostGIS is the standard for geospatial in PostgreSQL and is more capable than MongoDB's 2dsphere. Prisma doesn't natively support PostGIS types, but raw queries work well for the limited set of geospatial operations needed (nearby search, distance calculation).

**Alternative considered:** Storing lat/lng as separate `Float` columns and computing distances in application code — rejected because it doesn't scale for radius queries and can't use spatial indexes.

### D5: Application-level scheduled cleanup instead of TTL indexes

**Decision:** Replace MongoDB TTL indexes with NestJS `@Cron` scheduled tasks that query and delete expired records. Use the existing `@nestjs/schedule` module already in the project.

**Rationale:** PostgreSQL doesn't have TTL indexes. The project already uses `@nestjs/schedule` for cron jobs. A scheduled cleanup task (e.g., every hour) that deletes records past their `rejectedCompletelyDeleteAt` or `completelyDeletedAt` timestamp is simple and auditable.

**Alternative considered:** PostgreSQL `pg_cron` extension — rejected because it adds infrastructure dependency and Prisma can't manage it. Application-level is simpler and already has the pattern established.

### D6: Prisma base repository with generics

**Decision:** Replace `EntityRepository<T extends Document>` with a new `PrismaBaseRepository<TModel, TCreateInput, TUpdateInput, TWhereInput, TInclude>` generic class that wraps `PrismaClient` delegate methods. Each concrete repository specifies its Prisma-generated types as generic parameters.

**Example signature:**
```typescript
class CommercialsRepository extends PrismaBaseRepository<
  Commercial,                      // Prisma model type
  Prisma.CommercialCreateInput,    // Create input
  Prisma.CommercialUpdateInput,    // Update input
  Prisma.CommercialWhereInput,     // Filter input
  Prisma.CommercialInclude         // Include/relations
> { }
```

**Rationale:** Maintains the existing repository pattern the team is familiar with while getting full type safety from Prisma's generated types. No `unknown` or `any` in the data access layer.

### D7: Response DTOs with `class-transformer` serialization

**Decision:** Create response DTO classes for every endpoint, using `@Exclude()` and `@Expose()` decorators from `class-transformer` plus `@ApiProperty()` from `@nestjs/swagger`. Use `plainToInstance()` to transform Prisma results to response DTOs. Field `id` from Prisma will be exposed as `_id` in response DTOs for backward compatibility.

**Rationale:** Response DTOs decouple the database model from the API contract, enabling backward compatibility even if the Prisma schema diverges. Swagger gets accurate documentation from the DTO decorators.

### D8: JSON columns for nested structures

**Decision:** Store `opening` (operating hours), `displayOpening`, and pumpuang `history` as PostgreSQL `Json` type columns rather than normalized relational tables.

**Rationale:** These are write-once-read-many structures that are always loaded and saved as a whole unit. Normalizing them into separate tables (e.g., `commercial_opening_hours`, `opening_time_slots`) would require complex joins for every read with no querying benefit. Prisma's `Json` type with TypeScript interfaces gives adequate type safety at the application level.

**Alternative considered:** Fully normalized tables — rejected due to query complexity and performance overhead for data that's never queried independently.

### D9: Migration script approach

**Decision:** Two-phase migration:
1. **Schema migration**: Prisma `migrate dev` to create PostgreSQL tables from the Prisma schema
2. **Data migration**: A standalone TypeScript script (`scripts/migrate-from-mongo.ts`) that reads all MongoDB collections via the native MongoDB driver and inserts into PostgreSQL via Prisma client, handling ID mapping (ObjectId → UUID), relationship resolution, and data transformation

**Rationale:** Separating DDL from data migration keeps concerns clean. The script can be run independently, is idempotent (truncate + re-insert), and logs progress/errors. Using Prisma client for inserts ensures data passes validation.

### D10: Pumpuang location tracking data model

**Decision:** Split pumpuang location tracking into two tables: `PumpuangLocationSession` (one row per tracking session) and `PumpuangLocationPoint` (one row per GPS ping with a foreign key to session). The current MongoDB nested array `history: PumpuangHistory[][]` becomes normalized rows.

**Rationale:** GPS tracking data grows unboundedly and is queried by time range. Relational rows with indexes are far more efficient than MongoDB nested arrays for time-series queries and pagination.

## Risks / Trade-offs

**[Risk] Complex aggregation pipelines may not translate cleanly to Prisma**
→ Mitigation: The `$unionWith` pipeline in `CommercialsRepository.findShopsAndCommercials()` will use `prisma.$queryRaw` with a PostgreSQL `UNION` query. Other aggregations map to Prisma's `include`, `select`, and `where` clauses.

**[Risk] Geospatial queries require raw SQL, bypassing Prisma's type safety**
→ Mitigation: Encapsulate all geospatial queries in dedicated repository methods with typed wrappers. Use `Prisma.sql` tagged template literals for parameterized queries to prevent SQL injection.

**[Risk] Data migration may fail on corrupt/inconsistent MongoDB data**
→ Mitigation: Migration script validates data before insert, logs warnings for skipped records, and runs in a transaction per collection with rollback capability.

**[Risk] UUID format change from ObjectId could break mobile clients caching by ID**
→ Mitigation: Response DTOs expose `_id` field name. Document the format change. Consider providing an ObjectId→UUID mapping endpoint during transition if needed.

**[Risk] JSON columns (`opening`, `displayOpening`) lose database-level validation**
→ Mitigation: Validate JSON structure in DTOs before persisting. Define TypeScript interfaces matching the expected shape and validate with `class-validator`.

**[Trade-off] Single-table design adds nullable columns**
→ Accepted: The simplicity of single-table queries and no cross-table data movement outweighs the cost of nullable approval/deletion metadata columns.

**[Trade-off] PostGIS raw queries are less ergonomic than Prisma's fluent API**
→ Accepted: Geospatial queries are a small subset of total queries (~3-4 methods). The trade-off is contained and well-encapsulated.

## Migration Plan

### Phase 1: Schema & Infrastructure
1. Add PostgreSQL and PostGIS to Docker Compose
2. Install `prisma` and `@prisma/client` dependencies
3. Create Prisma schema with all models, enums, and relations
4. Run `prisma migrate dev` to generate initial migration
5. Update CI/CD pipeline to include PostgreSQL service

### Phase 2: Code Migration (module by module)
1. Create `PrismaBaseRepository` and `PrismaService` (NestJS module)
2. Create all request/response DTOs with Swagger decorators
3. Migrate modules one at a time: users → map → announcements → commercials → shares → pumpuangs
4. For each module: repository → service → controller (bottom-up)
5. Run existing API tests after each module to verify backward compatibility

### Phase 3: Data Migration
1. Run the MongoDB→PostgreSQL ETL script against staging data
2. Verify data integrity (row counts, relationship consistency, geospatial accuracy)
3. Run full API regression suite against migrated data
4. Schedule production migration window with rollback plan

### Rollback Strategy
- Keep MongoDB connection config as environment variable
- MongoDB data remains untouched during migration
- If PostgreSQL migration fails: revert code to `main` branch, switch `DATABASE_URL` back
- Migration script is idempotent — can be re-run after fixes

## Open Questions

1. **ID format**: Should we maintain a mapping table (old ObjectId → new UUID) for clients that may have cached old IDs? Or is a clean cut acceptable?
2. **Caching shop data**: The `CachingModule` caches external shop data in MongoDB schemas (`Shop`, `BotInfo`). Should these also migrate to PostgreSQL or remain in a separate store (Redis/MongoDB)?
3. **PostGIS availability**: Confirm that the target PostgreSQL deployment (dev, staging, prod) supports the PostGIS extension.
