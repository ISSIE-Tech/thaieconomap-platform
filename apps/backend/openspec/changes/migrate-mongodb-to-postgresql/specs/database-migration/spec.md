## ADDED Requirements

### Requirement: Prisma schema migration creates all tables

The system SHALL use `prisma migrate dev` to generate and apply SQL migrations that create all PostgreSQL tables, indexes, enums, and constraints defined in the Prisma schema.

#### Scenario: Initial migration creates all tables
- **WHEN** `npx prisma migrate dev --name init` is executed against an empty PostgreSQL database
- **THEN** all tables defined in the Prisma schema SHALL be created with correct columns, types, constraints, and indexes

#### Scenario: PostGIS extension is enabled
- **WHEN** the initial migration runs
- **THEN** the PostGIS extension SHALL be enabled via `CREATE EXTENSION IF NOT EXISTS postgis` in a custom migration SQL file

#### Scenario: Spatial indexes are created
- **WHEN** the migration completes
- **THEN** GIST spatial indexes SHALL exist on geometry columns for `Commercial` and `Share` tables

### Requirement: MongoDB to PostgreSQL data migration script

The system SHALL provide a standalone TypeScript script (`scripts/migrate-from-mongo.ts`) that reads all data from MongoDB and inserts it into PostgreSQL via the Prisma client.

#### Scenario: Script connects to both databases
- **WHEN** the migration script is executed
- **THEN** it SHALL connect to MongoDB via `MONGO_URI` environment variable and PostgreSQL via `DATABASE_URL` environment variable

#### Scenario: Script migrates all collections
- **WHEN** the migration script runs to completion
- **THEN** it SHALL migrate data from all MongoDB collections: users, favorites, commercials, pendingCommercials, deletedCommercials, businessTypes, restaurantTypes, pumpuangs, pendingPumpuangs, deletedPumpuangs, productTypes, pumpuangLocations, shares, pendingShares, deletedShares, shareTypes, shippingOptions, conditionOptions, announcements, districts

### Requirement: ID mapping from ObjectId to UUID

The migration script SHALL generate new UUIDs for all records and maintain a mapping of MongoDB ObjectId to PostgreSQL UUID for resolving foreign key references.

#### Scenario: ObjectId mapped to UUID
- **WHEN** a MongoDB document with `_id: ObjectId("...")` is migrated
- **THEN** a new UUID SHALL be generated for the PostgreSQL `id` column
- **AND** the mapping SHALL be stored in memory for reference resolution

#### Scenario: Foreign key references resolved via mapping
- **WHEN** a document references another document by ObjectId (e.g., `district: ObjectId("...")`)
- **THEN** the migration script SHALL look up the corresponding UUID from the mapping and set the foreign key column to that UUID

#### Scenario: Dangling references are handled gracefully
- **WHEN** a document references an ObjectId that doesn't exist in the target collection
- **THEN** the migration script SHALL log a warning with the source collection, document ID, and missing reference
- **AND** the foreign key column SHALL be set to `null` (if nullable) or the record SHALL be skipped with a log entry

### Requirement: Lifecycle status consolidation during migration

Records from separate pending/approved/deleted collections SHALL be merged into a single table with the appropriate `lifecycleStatus` value.

#### Scenario: Approved commercial migrated with APPROVED status
- **WHEN** a document from the `commercials` collection is migrated
- **THEN** it SHALL be inserted into the `Commercial` table with `lifecycleStatus: 'APPROVED'`

#### Scenario: Pending commercial migrated with PENDING status
- **WHEN** a document from the `pendingCommercials` collection is migrated
- **THEN** it SHALL be inserted into the `Commercial` table with `lifecycleStatus: 'PENDING'`

#### Scenario: Deleted commercial migrated with DELETED status
- **WHEN** a document from the `deletedCommercials` collection is migrated
- **THEN** it SHALL be inserted into the `Commercial` table with `lifecycleStatus: 'DELETED'`
- **AND** the `deletedAt`, `deletedBy`, `deletedAutoDelete`, and `completelyDeletedAt` columns SHALL be populated from the source document

### Requirement: Polymorphic type references resolved to explicit relations

The migration script SHALL convert polymorphic `typeRefPath` + `types` arrays into explicit many-to-many relation records.

#### Scenario: Business type references migrated
- **WHEN** a commercial document has `typeRefPath: 'BusinessType'` and `types: [ObjectId("a"), ObjectId("b")]`
- **THEN** the migration SHALL create join table records linking the commercial to the corresponding BusinessType UUIDs

#### Scenario: Restaurant type references migrated
- **WHEN** a commercial document has `typeRefPath: 'RestaurantType'` and `types: [ObjectId("x")]`
- **THEN** the migration SHALL create join table records linking the commercial to the corresponding RestaurantType UUID

### Requirement: GeoJSON coordinates converted to PostGIS geometry

The migration script SHALL convert MongoDB GeoJSON `location` objects into PostGIS geometry values and populate lat/lng columns.

#### Scenario: Point location converted to PostGIS
- **WHEN** a document has `location: { type: 'Point', coordinates: [lng, lat] }`
- **THEN** the migration SHALL insert a PostGIS `ST_SetSRID(ST_MakePoint(lng, lat), 4326)` geometry value
- **AND** populate `latitude` and `longitude` Float columns

### Requirement: Nested arrays converted to relational tables

MongoDB nested arrays that are normalized in the new schema SHALL be migrated to separate table rows.

#### Scenario: Pumpuang location history migrated to sessions and points
- **WHEN** a `pumpuangLocations` document with `history: [[{location, trackedAt}, ...], ...]` is migrated
- **THEN** each inner array SHALL become a `PumpuangLocationSession` record
- **AND** each object within the inner array SHALL become a `PumpuangLocationPoint` record linked to its session

#### Scenario: Share requests migrated to ShareRequest table
- **WHEN** a share document has `requests: [{ user: ObjectId, status: 'PENDING' }, ...]`
- **THEN** each request entry SHALL become a `ShareRequest` record with resolved `userId` UUID and `shareId` UUID

### Requirement: Migration script is idempotent

The migration script SHALL be safe to re-run without creating duplicate data.

#### Scenario: Re-running migration clears existing data first
- **WHEN** the migration script is executed against a PostgreSQL database that already contains migrated data
- **THEN** it SHALL truncate all tables (respecting foreign key order) before re-inserting
- **AND** it SHALL log that a re-run is in progress

### Requirement: Migration script provides progress and error reporting

The migration script SHALL log progress and errors during execution.

#### Scenario: Progress logged per collection
- **WHEN** a collection is being migrated
- **THEN** the script SHALL log the collection name, total document count, and number of successfully migrated records

#### Scenario: Errors logged with context
- **WHEN** a document fails to migrate (e.g., validation error, missing reference)
- **THEN** the script SHALL log the error with the source collection, document `_id`, and error message
- **AND** the script SHALL continue migrating remaining documents (not abort on single failure)

#### Scenario: Summary logged at completion
- **WHEN** the migration script finishes
- **THEN** it SHALL log a summary table showing: collection name, total documents, migrated count, skipped count, and error count for each collection

### Requirement: Migration runs within a transaction per collection

Each collection's migration SHALL run within a PostgreSQL transaction for atomicity.

#### Scenario: Failed collection migration rolls back
- **WHEN** a critical error occurs during migration of a collection (e.g., constraint violation on bulk insert)
- **THEN** all inserts for that collection SHALL be rolled back
- **AND** the script SHALL continue with the next collection

#### Scenario: Successful collection migration commits
- **WHEN** all documents in a collection are successfully migrated
- **THEN** the transaction SHALL be committed and the data SHALL be persisted
