## 1. Infrastructure & Dependencies

- [ ] 1.1 Add `prisma`, `@prisma/client` to dependencies; remove `mongoose`, `@nestjs/mongoose` from package.json
- [ ] 1.2 Add PostgreSQL and PostGIS services to Docker Compose
- [ ] 1.3 Add `DATABASE_URL` environment variable to config validation schema and `.env.example`
- [ ] 1.4 Update `.gitlab-ci.yml` to include PostgreSQL service for CI

## 2. Prisma Schema

- [ ] 2.1 Create `prisma/schema.prisma` with datasource, generator, and all enums (`LifecycleStatus`, `CommercialCategory`, `SubmissionStatus`, `UserRole`, `PumpuangStatus`, `ShareStatus`, `FavoriteType`, `DayName`)
- [ ] 2.2 Define `User` and `Favorite` models with UUID primary keys, relations, and timestamps
- [ ] 2.3 Define `District` model with province/district fields
- [ ] 2.4 Define `Commercial` model with single-table lifecycle pattern (`lifecycleStatus` enum, nullable approval/deletion columns), JSON columns for `opening`/`displayOpening`, latitude/longitude floats, and PostGIS `location` geometry column via `Unsupported`
- [ ] 2.5 Define `BusinessType` and `RestaurantType` models with many-to-many join tables to `Commercial`
- [ ] 2.6 Define `Pumpuang` model with single-table lifecycle pattern, JSON columns for opening/displayOpening, and nullable auth fields (`refreshToken`)
- [ ] 2.7 Define `ProductType` model with many-to-many relation to `Pumpuang`
- [ ] 2.8 Define `PumpuangLocationSession` and `PumpuangLocationPoint` models with session-to-points one-to-many relation
- [ ] 2.9 Define `Share` model with single-table lifecycle pattern, JSON columns, PostGIS location, and nested contact/amount as JSON
- [ ] 2.10 Define `ShareRequest` model (extracted from embedded array) with foreign keys to `Share` and `User`
- [ ] 2.11 Define `ShareType`, `ShippingOption`, `ConditionOption` models with relations to `Share`
- [ ] 2.12 Define `Announcement` model with district relation, start/end dates, and TTL-related columns
- [ ] 2.13 Run `npx prisma migrate dev --name init` to generate initial migration SQL
- [ ] 2.14 Add custom migration SQL for PostGIS extension (`CREATE EXTENSION IF NOT EXISTS postgis`) and GIST spatial indexes on geometry columns
- [ ] 2.15 Run `npx prisma generate` and verify all types are available in `@prisma/client`

## 3. Shared Database Layer

- [ ] 3.1 Create `PrismaService` extending `PrismaClient` with `OnModuleInit`/`OnModuleDestroy` lifecycle hooks
- [ ] 3.2 Create `PrismaModule` as a global NestJS module exporting `PrismaService`
- [ ] 3.3 Create `PrismaBaseRepository<TModel, TCreateInput, TUpdateInput, TWhereInput, TInclude>` generic base class with methods: `findMany`, `findById`, `findOne`, `create`, `update`, `delete`, `deleteMany`, `count`
- [ ] 3.4 Add `findWithPagination` method to base repository with pattern search (case-insensitive `contains`), sorting, and `IPaginationResponse<T>` return type
- [ ] 3.5 Update `AppModule` to replace `MongooseModule.forRootAsync` with `PrismaModule`

## 4. Shared DTOs & Types

- [ ] 4.1 Create shared `PaginationResponseDto<T>` with `@ApiProperty()` decorators matching existing `IPaginationResponse` shape
- [ ] 4.2 Create shared `LocationDto`, `OpeningDto`, `OpeningTimeDto`, `DisplayOpeningDto` request DTOs (preserving existing validators)
- [ ] 4.3 Create shared `LocationResponseDto`, `OpeningResponseDto`, `DisplayOpeningResponseDto` response DTOs with Swagger decorators
- [ ] 4.4 Create base response DTO with `@Expose({ name: '_id' })` for the `id` field mapping
- [ ] 4.5 Define TypeScript interfaces for JSON column shapes (`IOpening`, `IDisplayOpening`, `IContact`, `IAmountWithUnit`)

## 5. Users Module Migration

- [ ] 5.1 Create `UsersRepository` extending `PrismaBaseRepository` with User Prisma types
- [ ] 5.2 Create `FavoriteRepository` extending `PrismaBaseRepository` with Favorite Prisma types
- [ ] 5.3 Create request DTOs: `CreateUserRequestDto`, `UpdatePrivilegeUserRequestDto`, `GetFavoriteQueryDto`
- [ ] 5.4 Create response DTOs: `UserResponseDto`, `FavoriteResponseDto`
- [ ] 5.5 Refactor `UsersService` with explicit `Promise<T>` return types using response DTOs and Prisma input types for repository calls
- [ ] 5.6 Refactor `UsersController` with explicit `Promise<T>` return types and Swagger response decorators matching DTOs
- [ ] 5.7 Update `UsersModule` to import `PrismaModule` and register new repositories as providers
- [ ] 5.8 Remove Mongoose schema imports and old repository references from Users module

## 6. Map Module Migration

- [ ] 6.1 Create `DistrictsRepository` extending `PrismaBaseRepository` with District Prisma types
- [ ] 6.2 Create request/response DTOs: `GetDistrictsQueryDto`, `DistrictResponseDto`
- [ ] 6.3 Refactor `MapService` and `MapController` with explicit `Promise<T>` return types
- [ ] 6.4 Update `MapModule` providers and remove Mongoose dependencies

## 7. Announcements Module Migration

- [ ] 7.1 Create `AnnouncementsRepository` extending `PrismaBaseRepository` with Announcement Prisma types
- [ ] 7.2 Create request DTOs: `CreateAnnouncementRequestDto`, `UpdateAnnouncementRequestDto`, `GetAnnouncementsQueryDto`
- [ ] 7.3 Create response DTO: `AnnouncementResponseDto` with computed `isAvailable` and `status` fields
- [ ] 7.4 Refactor `AnnouncementsService` with explicit `Promise<T>` return types, computed field logic (isAvailable/status) in service layer, and Prisma input types
- [ ] 7.5 Refactor `AnnouncementsController` with explicit `Promise<T>` return types and Swagger decorators
- [ ] 7.6 Update `AnnouncementsModule` and remove Mongoose dependencies

## 8. Commercials Module Migration

- [ ] 8.1 Create `CommercialsRepository` extending `PrismaBaseRepository` with Commercial Prisma types, including geospatial query methods (`findWithinRadius`) using PostGIS raw SQL
- [ ] 8.2 Create `BusinessTypesRepository` and `RestaurantTypesRepository` extending `PrismaBaseRepository`
- [ ] 8.3 Create request DTOs: `CreateCommercialRequestDto`, `UpdateCommercialRequestDto`, `GetCommercialsQueryDto`, `GetCommercialsTinyQueryDto`, `CreateBusinessTypeRequestDto`, `CreateRestaurantTypeRequestDto`
- [ ] 8.4 Create response DTOs: `CommercialResponseDto`, `CommercialTinyResponseDto`, `BusinessTypeResponseDto`, `RestaurantTypeResponseDto`
- [ ] 8.5 Refactor `CommercialsService` with explicit `Promise<T>` return types, `plainToInstance()` transformation, and Prisma input types for all repository calls
- [ ] 8.6 Replace `findShopsAndCommercials` aggregation pipeline with Prisma query + `prisma.$queryRaw` PostgreSQL UNION
- [ ] 8.7 Refactor all Commercials controllers (`CommercialsController`, `AllCommercialsController`, `PendingCommercialsController`, `DeletedCommercialsController`) with explicit `Promise<T>` return types and Swagger decorators
- [ ] 8.8 Refactor `BusinessTypesController` and `RestaurantTypesController` with typed returns
- [ ] 8.9 Refactor lifecycle operations (approve/reject/delete) to update `lifecycleStatus` column instead of moving documents between collections
- [ ] 8.10 Update `CommercialsModule` and remove all Mongoose dependencies

## 9. Shares Module Migration

- [ ] 9.1 Create `SharesRepository` extending `PrismaBaseRepository` with Share Prisma types, including geospatial methods
- [ ] 9.2 Create `ShareTypesRepository`, `ConditionOptionsRepository`, `ShippingOptionsRepository` extending `PrismaBaseRepository`
- [ ] 9.3 Create request DTOs: `CreateShareRequestDto`, `UpdateShareRequestDto`, `GetSharesQueryDto`, `GetTinySharesQueryDto`, `ContactDto`, `AmountWithUnitDto`, `CreateShareTypeRequestDto`, `CreateConditionOptionRequestDto`, `CreateShippingOptionRequestDto`
- [ ] 9.4 Create response DTOs: `ShareResponseDto`, `ShareTinyResponseDto`, `ShareTypeResponseDto`, `ConditionOptionResponseDto`, `ShippingOptionResponseDto`
- [ ] 9.5 Refactor `SharesService` with explicit `Promise<T>` return types, DTO transformation, and Prisma input types
- [ ] 9.6 Migrate share request handling from embedded array to `ShareRequest` table operations
- [ ] 9.7 Refactor all Shares controllers with explicit return types and Swagger decorators
- [ ] 9.8 Refactor lifecycle operations for shares (approve/reject/delete via `lifecycleStatus`)
- [ ] 9.9 Update `SharesModule` and remove Mongoose dependencies

## 10. Pumpuangs Module Migration

- [ ] 10.1 Create `PumpuangsRepository` extending `PrismaBaseRepository` with Pumpuang Prisma types
- [ ] 10.2 Create `ProductTypesRepository` extending `PrismaBaseRepository`
- [ ] 10.3 Create `PumpuangLocationSessionRepository` and `PumpuangLocationPointRepository` for GPS tracking
- [ ] 10.4 Create request DTOs: `CreatePumpuangRequestDto`, `UpdatePumpuangRequestDto`, `GetPumpuangsQueryDto`, `GetPumpuangTinyQueryDto`, `PumpuangLocationRequestDto`, `RequestOtpRequestDto`, `VerifyOtpRequestDto`, `CreateProductTypeRequestDto`
- [ ] 10.5 Create response DTOs: `PumpuangResponseDto`, `PumpuangTinyResponseDto`, `PumpuangRouteResponseDto`, `PumpuangRequestOtpResponseDto`, `PumpuangAuthResponseDto`, `CredentialsResponseDto`, `PumpuangStatusResponseDto`, `PumpuangLocationTrackingResponseDto`, `ProductTypeResponseDto`
- [ ] 10.6 Refactor `PumpuangsService` with explicit `Promise<T>` return types and Prisma input types
- [ ] 10.7 Refactor location tracking methods (`startTracking`, `stopTracking`, `riderTracking`) to use `PumpuangLocationSession` and `PumpuangLocationPoint` tables
- [ ] 10.8 Refactor pumpuang auth methods (`requestOtp`, `verifyOtp`, `generateCredentials`, `revokeRefreshToken`) with typed returns
- [ ] 10.9 Refactor all Pumpuangs controllers with explicit return types and Swagger decorators
- [ ] 10.10 Refactor lifecycle operations for pumpuangs (approve/reject/delete via `lifecycleStatus`)
- [ ] 10.11 Update `PumpuangsModule` and remove Mongoose dependencies

## 11. Cleanup & Shared Layer

- [ ] 11.1 Add `@Cron` scheduled task for TTL cleanup: delete records where `completelyDeletedAt < now()` or `rejectedCompletelyDeleteAt < now()` across Commercial, Pumpuang, Share tables
- [ ] 11.2 Add `@Cron` scheduled task for expired announcement cleanup (`expiredAutoDelete`)
- [ ] 11.3 Remove `EntityRepository` base class and all Mongoose-related shared code (`shared/database/entity.repository.ts`, shared schemas)
- [ ] 11.4 Remove all Mongoose schema files from every module
- [ ] 11.5 Remove `mongoose` and `@nestjs/mongoose` from `package.json` and run `npm install`
- [ ] 11.6 Update `CachingModule` to use Prisma or Redis-only for cached shop/bot data (remove MongoDB schema dependency)

## 12. Data Migration Script

- [ ] 12.1 Create `scripts/migrate-from-mongo.ts` with MongoDB native driver connection and Prisma client setup
- [ ] 12.2 Implement ID mapping system: generate UUIDs for all MongoDB ObjectIds and store in-memory map per collection
- [ ] 12.3 Implement migration for reference data first: `districts`, `businessTypes`, `restaurantTypes`, `productTypes`, `shareTypes`, `shippingOptions`, `conditionOptions`
- [ ] 12.4 Implement migration for `users` and `favorites` with ObjectId→UUID resolution
- [ ] 12.5 Implement migration for `commercials` (approved), `pendingCommercials`, `deletedCommercials` into single `Commercial` table with appropriate `lifecycleStatus`, including polymorphic type resolution to explicit join table records
- [ ] 12.6 Implement migration for GeoJSON coordinates to PostGIS geometry + lat/lng columns (commercials and shares)
- [ ] 12.7 Implement migration for `shares` (approved), `pendingShares`, `deletedShares` into single `Share` table, including embedded `requests` array to `ShareRequest` table
- [ ] 12.8 Implement migration for `pumpuangs` (approved), `pendingPumpuangs`, `deletedPumpuangs` into single `Pumpuang` table
- [ ] 12.9 Implement migration for `pumpuangLocations` nested history arrays to `PumpuangLocationSession` + `PumpuangLocationPoint` rows
- [ ] 12.10 Implement migration for `announcements` with district reference resolution
- [ ] 12.11 Add idempotency: truncate all tables (in FK-safe order) before re-inserting
- [ ] 12.12 Add progress logging per collection and summary table at completion
- [ ] 12.13 Add per-collection transaction wrapping with rollback on failure
- [ ] 12.14 Add dangling reference handling: log warnings and set nullable FKs to null
- [ ] 12.15 Add npm script `migrate:from-mongo` to `package.json` for running the migration

## 13. Verification

- [ ] 13.1 Verify all TypeScript files compile with strict mode (no `any`/`unknown` in repository, service, or controller public methods)
- [ ] 13.2 Verify Swagger UI shows correct request/response schemas for all endpoints
- [ ] 13.3 Verify backward compatibility: all response JSON shapes match pre-migration format (especially `_id` field mapping)
- [ ] 13.4 Run migration script against staging MongoDB data and verify row counts match document counts
- [ ] 13.5 Verify geospatial queries return correct results (nearby search, radius filtering)
- [ ] 13.6 Verify TTL cleanup cron jobs delete expired records correctly
- [ ] 13.7 Verify pumpuang location tracking flow works end-to-end with new session/point tables
