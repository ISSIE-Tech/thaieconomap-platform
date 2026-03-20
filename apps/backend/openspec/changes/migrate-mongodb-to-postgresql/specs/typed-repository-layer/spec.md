## ADDED Requirements

### Requirement: PrismaBaseRepository generic base class

The system SHALL provide a `PrismaBaseRepository<TModel, TCreateInput, TUpdateInput, TWhereInput, TInclude>` generic base class that wraps Prisma client delegate methods with the same method signatures the codebase currently uses.

#### Scenario: Base repository provides typed CRUD methods
- **WHEN** a concrete repository extends `PrismaBaseRepository`
- **THEN** it SHALL inherit typed methods: `findMany`, `findById`, `findOne`, `create`, `update`, `delete`, `count`, `findWithPagination`

#### Scenario: Create method accepts only Prisma-generated input type
- **WHEN** `repository.create(data)` is called
- **THEN** the `data` parameter type SHALL be `TCreateInput` (e.g., `Prisma.CommercialCreateInput`)
- **AND** passing an object that doesn't match the Prisma input type SHALL cause a TypeScript compilation error

#### Scenario: Filter methods accept only Prisma where input type
- **WHEN** `repository.findMany(where)` is called
- **THEN** the `where` parameter type SHALL be `TWhereInput` (e.g., `Prisma.CommercialWhereInput`)
- **AND** passing invalid filter fields SHALL cause a TypeScript compilation error

### Requirement: PrismaService NestJS module

The system SHALL provide a `PrismaService` that extends `PrismaClient` and implements NestJS `OnModuleInit` and `OnModuleDestroy` lifecycle hooks for connection management.

#### Scenario: PrismaService connects on module init
- **WHEN** the NestJS application starts
- **THEN** `PrismaService` SHALL call `$connect()` to establish the database connection

#### Scenario: PrismaService disconnects on module destroy
- **WHEN** the NestJS application shuts down
- **THEN** `PrismaService` SHALL call `$disconnect()` to clean up the database connection

#### Scenario: PrismaService is injectable as global provider
- **WHEN** any repository or service needs database access
- **THEN** it SHALL inject `PrismaService` via NestJS dependency injection

### Requirement: Concrete repository per entity

Each entity SHALL have a dedicated concrete repository class that extends `PrismaBaseRepository` with entity-specific Prisma types.

#### Scenario: CommercialsRepository uses Commercial Prisma types
- **WHEN** `CommercialsRepository` is instantiated
- **THEN** it SHALL extend `PrismaBaseRepository<Commercial, Prisma.CommercialCreateInput, Prisma.CommercialUpdateInput, Prisma.CommercialWhereInput, Prisma.CommercialInclude>`

#### Scenario: All existing repositories have Prisma equivalents
- **WHEN** the repository layer is inspected
- **THEN** concrete repositories SHALL exist for: `CommercialsRepository`, `BusinessTypesRepository`, `RestaurantTypesRepository`, `PumpuangsRepository`, `ProductTypesRepository`, `SharesRepository`, `ShareTypesRepository`, `ConditionOptionsRepository`, `ShippingOptionsRepository`, `UsersRepository`, `FavoriteRepository`, `AnnouncementsRepository`, `DistrictsRepository`

### Requirement: Pagination support in base repository

The base repository SHALL provide a `findWithPagination` method that returns typed paginated results matching the existing `IPaginationResponse<T>` interface.

#### Scenario: Paginated query returns metadata
- **WHEN** `repository.findWithPagination({ page: 2, perPage: 10, where: {...} })` is called
- **THEN** the result SHALL contain `data: TModel[]` and `metaData: { count, perPage, prevPage, currentPage, nextPage, lastPage }`

#### Scenario: Paginated query supports pattern search
- **WHEN** `findWithPagination` is called with `patternSearchProperties: ['name']` and a name filter
- **THEN** the query SHALL use case-insensitive `contains` matching (equivalent to MongoDB `$regex` with `$options: 'i'`)

#### Scenario: Paginated query supports sorting
- **WHEN** `findWithPagination` is called with `sortedBy: 'createdAt'` and `direction: 'DESC'`
- **THEN** results SHALL be ordered by `createdAt` descending

### Requirement: Include/relation loading in repository methods

Repository methods SHALL support Prisma `include` for eager loading related entities.

#### Scenario: Find commercial with included relations
- **WHEN** `commercialsRepository.findById(id, { include: { district: true, businessTypes: true } })` is called
- **THEN** the result SHALL include the full `district` and `businessTypes` objects, not just foreign key IDs

#### Scenario: Include parameter is type-safe
- **WHEN** a developer passes an include object to a repository method
- **THEN** only valid relation names for that model SHALL be accepted (TypeScript compilation error otherwise)

### Requirement: Geospatial query methods in relevant repositories

Repositories for entities with location data SHALL provide dedicated methods for geospatial queries using raw SQL with PostGIS.

#### Scenario: Find commercials within radius
- **WHEN** `commercialsRepository.findWithinRadius(lat, lng, radiusMeters)` is called
- **THEN** it SHALL execute a PostGIS `ST_DWithin` query and return commercials within the specified radius
- **AND** the method return type SHALL be `Promise<Commercial[]>`

#### Scenario: Geospatial queries are parameterized
- **WHEN** a geospatial repository method is called
- **THEN** all user-provided values (lat, lng, radius) SHALL be passed as parameterized values via `Prisma.sql` to prevent SQL injection

### Requirement: No unknown or any types in repository layer

No repository method SHALL use `unknown`, `any`, or untyped object parameters. All inputs and outputs SHALL use Prisma-generated types or explicitly defined interfaces.

#### Scenario: Repository create method rejects untyped data
- **WHEN** `repository.create(untypedObject as any)` is attempted
- **THEN** a TypeScript strict-mode compilation SHALL flag this unless the object matches the Prisma input type

#### Scenario: Repository return types are explicit
- **WHEN** any repository method is inspected
- **THEN** its return type SHALL be an explicit `Promise<T>` where `T` is a Prisma model type, an array thereof, or `IPaginationResponse<T>`
