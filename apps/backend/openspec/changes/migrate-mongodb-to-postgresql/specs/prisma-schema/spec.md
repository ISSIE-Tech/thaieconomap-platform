## ADDED Requirements

### Requirement: Prisma schema defines all application models

The system SHALL have a single `prisma/schema.prisma` file that defines all database models, enums, relations, and indexes for the PostgreSQL database. The schema SHALL be the single source of truth for the database structure and SHALL generate TypeScript types via `prisma generate`.

#### Scenario: Schema contains all entity models
- **WHEN** the Prisma schema is inspected
- **THEN** it SHALL contain models for: `User`, `Favorite`, `Commercial`, `BusinessType`, `RestaurantType`, `Pumpuang`, `ProductType`, `PumpuangLocationSession`, `PumpuangLocationPoint`, `Share`, `ShareType`, `ShippingOption`, `ConditionOption`, `Announcement`, `District`

#### Scenario: Generated types are available after prisma generate
- **WHEN** `npx prisma generate` is executed
- **THEN** TypeScript types for all models, enums, and input types (e.g., `Prisma.CommercialCreateInput`, `Prisma.CommercialWhereInput`) SHALL be available in `@prisma/client`

### Requirement: UUID primary keys for all models

All models SHALL use `String @id @default(uuid())` as their primary key column named `id`.

#### Scenario: New record gets UUID primary key
- **WHEN** a new record is created in any table without specifying an `id`
- **THEN** a UUID string SHALL be auto-generated as the primary key

### Requirement: Single-table lifecycle pattern with status enum

Entities with approval workflows (Commercial, Pumpuang, Share) SHALL use a single table with a `lifecycleStatus` enum column (`PENDING`, `APPROVED`, `DELETED`) instead of separate tables per lifecycle stage.

#### Scenario: Commercial model contains lifecycle columns
- **WHEN** the `Commercial` model is inspected
- **THEN** it SHALL have a `lifecycleStatus` column of enum type `LifecycleStatus` with values `PENDING`, `APPROVED`, `DELETED`
- **AND** it SHALL have nullable columns: `approvedAt DateTime?`, `approvedBy String?`, `deletedAt DateTime?`, `deletedBy String?`, `deletedAutoDelete DateTime?`, `completelyDeletedAt DateTime?`

#### Scenario: Querying only approved commercials
- **WHEN** a query filters by `lifecycleStatus: 'APPROVED'`
- **THEN** only approved commercials SHALL be returned (equivalent to querying the old `commercials` collection)

#### Scenario: Querying only pending commercials
- **WHEN** a query filters by `lifecycleStatus: 'PENDING'`
- **THEN** only pending commercials SHALL be returned (equivalent to querying the old `pendingCommercials` collection)

### Requirement: Explicit relational foreign keys replace polymorphic references

The Commercial model SHALL use explicit many-to-many relations for `businessTypes` and `restaurantTypes` instead of the polymorphic `typeRefPath` + `types` pattern.

#### Scenario: Commercial with business category has business types
- **WHEN** a Commercial record has `category: 'BUSINESS'`
- **THEN** its `businessTypes` relation SHALL contain the associated BusinessType records
- **AND** its `restaurantTypes` relation SHALL be empty

#### Scenario: Commercial with restaurant category has restaurant types
- **WHEN** a Commercial record has `category: 'RESTAURANT'`
- **THEN** its `restaurantTypes` relation SHALL contain the associated RestaurantType records
- **AND** its `businessTypes` relation SHALL be empty

### Requirement: All enums defined in Prisma schema

All application enums SHALL be defined as Prisma `enum` types in the schema file.

#### Scenario: Enum types are defined
- **WHEN** the Prisma schema is inspected
- **THEN** it SHALL define enums for: `LifecycleStatus`, `CommercialCategory`, `SubmissionStatus`, `UserRole`, `PumpuangStatus`, `ShareStatus`, `FavoriteType`, `DayName`

### Requirement: JSON columns for nested structures

Operating hours (`opening`), display opening hours (`displayOpening`), and pumpuang tracking history SHALL be stored as `Json` type columns.

#### Scenario: Commercial stores opening hours as JSON
- **WHEN** a Commercial record is created with opening hours data
- **THEN** the `opening` column SHALL store the full array of day/hours objects as a JSON value
- **AND** the `displayOpening` column SHALL store the formatted display data as a JSON value

### Requirement: PostGIS geospatial support

Models with location data (Commercial, Share) SHALL use a PostGIS `geometry(Point, 4326)` column for spatial indexing and queries.

#### Scenario: Location column uses PostGIS type
- **WHEN** the Commercial model's `location` column is inspected in PostgreSQL
- **THEN** it SHALL be of type `geometry(Point, 4326)` with a GIST spatial index

#### Scenario: Latitude and longitude are stored alongside geometry
- **WHEN** a Commercial record is created with coordinates
- **THEN** the `latitude` and `longitude` Float columns SHALL also be populated for non-spatial reads
- **AND** the `location` geometry column SHALL be populated for spatial queries

### Requirement: Relational foreign keys with proper constraints

All foreign key relationships SHALL be defined with explicit `@relation` directives and appropriate `onDelete` behavior.

#### Scenario: Commercial references district
- **WHEN** the Commercial model is inspected
- **THEN** it SHALL have a `districtId String` column with a `@relation` to the `District` model

#### Scenario: Favorite references user
- **WHEN** the Favorite model is inspected
- **THEN** it SHALL have a `userId String` column with a `@relation` to the `User` model
- **AND** deleting a User SHALL cascade-delete their Favorites

### Requirement: Timestamps on all models

All models SHALL have `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt` columns.

#### Scenario: New record has automatic timestamps
- **WHEN** a new record is created
- **THEN** `createdAt` SHALL be set to the current timestamp
- **AND** `updatedAt` SHALL be set to the current timestamp

#### Scenario: Updated record refreshes updatedAt
- **WHEN** an existing record is updated
- **THEN** `updatedAt` SHALL be updated to the current timestamp
- **AND** `createdAt` SHALL remain unchanged

### Requirement: Pumpuang location tracking normalized tables

Pumpuang GPS tracking data SHALL be stored in two related tables: `PumpuangLocationSession` and `PumpuangLocationPoint`.

#### Scenario: Starting a tracking session creates a session record
- **WHEN** a pumpuang rider starts tracking
- **THEN** a `PumpuangLocationSession` record SHALL be created with `pumpuangId`, `startedAt`, and nullable `stoppedAt`

#### Scenario: GPS pings create location point records
- **WHEN** a GPS location update is received during an active session
- **THEN** a `PumpuangLocationPoint` record SHALL be created with `sessionId`, `latitude`, `longitude`, `trackedAt`, and optional `direction`

### Requirement: Share model supports requests as related table

Share request entries (users requesting a shared item) SHALL be stored in a separate `ShareRequest` table with a foreign key to `Share`.

#### Scenario: Share request creates a related record
- **WHEN** a user requests a share
- **THEN** a `ShareRequest` record SHALL be created with `shareId`, `userId`, and `status` defaulting to `PENDING`
