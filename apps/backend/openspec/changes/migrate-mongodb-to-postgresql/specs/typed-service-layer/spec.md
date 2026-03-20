## ADDED Requirements

### Requirement: All service methods have explicit Promise return types

Every public method in every service class SHALL declare an explicit return type of `Promise<T>` where `T` is a response DTO, a Prisma-generated type, or a primitive.

#### Scenario: Service method returns response DTO
- **WHEN** `commercialsService.getCommercialById(user, id)` is inspected
- **THEN** its return type SHALL be `Promise<CommercialResponseDto>`

#### Scenario: Service method returning list uses array of response DTO
- **WHEN** `commercialsService.getAllCommercials(user)` is inspected
- **THEN** its return type SHALL be `Promise<CommercialResponseDto[]>` or `Promise<CommercialTinyResponseDto[]>`

#### Scenario: Service method returning paginated results uses typed pagination
- **WHEN** `commercialsService.getCommercials(user, query)` is inspected
- **THEN** its return type SHALL be `Promise<PaginationResponseDto<CommercialResponseDto>>`

#### Scenario: No service method returns any or unknown
- **WHEN** all service files are inspected via TypeScript strict mode
- **THEN** no public method SHALL have an implicit, `any`, or `unknown` return type

### Requirement: All controller handlers have explicit Promise return types

Every controller handler method SHALL declare an explicit return type of `Promise<T>` matching the response DTO for that endpoint.

#### Scenario: Controller GET handler returns response DTO
- **WHEN** the `GET /commercials/:commercialId` handler is inspected
- **THEN** its return type SHALL be `Promise<CommercialResponseDto>`

#### Scenario: Controller POST handler returns created resource DTO
- **WHEN** the `POST /commercials` handler is inspected
- **THEN** its return type SHALL be `Promise<CommercialResponseDto>`

#### Scenario: Controller paginated handler returns pagination DTO
- **WHEN** the `GET /commercials` handler (paginated list) is inspected
- **THEN** its return type SHALL be `Promise<PaginationResponseDto<CommercialResponseDto>>`

#### Scenario: Controller DELETE handler returns void or confirmation
- **WHEN** a DELETE handler is inspected
- **THEN** its return type SHALL be `Promise<void>` or `Promise<DeleteResponseDto>` (not untyped)

### Requirement: Services transform Prisma results to response DTOs

Service methods SHALL use `plainToInstance()` from `class-transformer` to transform raw Prisma query results into response DTO instances before returning.

#### Scenario: Prisma result is transformed to response DTO
- **WHEN** a service method fetches data from the repository
- **THEN** it SHALL call `plainToInstance(ResponseDto, prismaResult, { excludeExtraneousValues: true })` before returning

#### Scenario: Prisma id field is mapped to _id in response
- **WHEN** a Prisma result with `id` field is transformed to a response DTO
- **THEN** the response DTO SHALL expose it as `_id` for backward compatibility

### Requirement: Services use Prisma-generated types for repository calls

All data passed from services to repository methods SHALL use Prisma-generated input types, not raw objects or `any`.

#### Scenario: Service creates commercial with Prisma input type
- **WHEN** `commercialsService.createCommercial()` builds the data for `repository.create()`
- **THEN** the data object SHALL satisfy `Prisma.CommercialCreateInput` at compile time

#### Scenario: Service updates with Prisma update input type
- **WHEN** a service method builds an update payload
- **THEN** the payload SHALL satisfy `Prisma.XxxUpdateInput` at compile time

### Requirement: Controller Swagger decorators match return types

Every controller handler SHALL have `@ApiOkResponse()`, `@ApiCreatedResponse()`, or equivalent Swagger decorators whose `type` matches the handler's return type DTO.

#### Scenario: GET handler Swagger response matches return DTO
- **WHEN** the `GET /commercials/:id` handler has `@ApiOkResponse({ type: CommercialResponseDto })`
- **THEN** the handler's TypeScript return type SHALL also be `Promise<CommercialResponseDto>`

#### Scenario: POST handler Swagger response matches return DTO
- **WHEN** the `POST /pumpuangs` handler has `@ApiCreatedResponse({ type: PumpuangResponseDto })`
- **THEN** the handler's TypeScript return type SHALL also be `Promise<PumpuangResponseDto>`

### Requirement: Announcement virtual fields computed in service layer

The Announcement entity's computed fields (`isAvailable`, `status`) SHALL be calculated in the service layer and included in the response DTO, not stored in the database.

#### Scenario: Announcement response includes computed isAvailable
- **WHEN** an announcement is fetched
- **THEN** the response DTO SHALL include `isAvailable: boolean` computed as `now >= startAt && now < endAt`

#### Scenario: Announcement response includes computed status
- **WHEN** an announcement is fetched
- **THEN** the response DTO SHALL include `status` computed as `PENDING` (before startAt), `ANNOUNCED` (between startAt and endAt), or `EXPIRED` (after endAt)

### Requirement: Pumpuang auth service methods have typed returns

Pumpuang authentication methods SHALL return explicitly typed promises.

#### Scenario: OTP request returns typed response
- **WHEN** `pumpuangsService.pumpuangRequestOtp(dto)` is called
- **THEN** its return type SHALL be `Promise<PumpuangRequestOtpResponseDto>`

#### Scenario: OTP verify returns typed auth response
- **WHEN** `pumpuangsService.pumpuangVerifyOtp(dto)` is called
- **THEN** its return type SHALL be `Promise<PumpuangAuthResponseDto>`

#### Scenario: Token refresh returns typed credentials
- **WHEN** `pumpuangsService.generatePumpuangCredentials(id)` is called
- **THEN** its return type SHALL be `Promise<CredentialsResponseDto>`
