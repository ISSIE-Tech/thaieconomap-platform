## ADDED Requirements

### Requirement: Request DTOs for all mutation endpoints

Every POST and PUT endpoint SHALL have a dedicated request DTO class with `class-validator` decorators for input validation and `@ApiProperty()` decorators for Swagger documentation.

#### Scenario: Create commercial endpoint has request DTO
- **WHEN** a POST request is sent to create a commercial
- **THEN** the request body SHALL be validated against `CreateCommercialRequestDto` which defines all required and optional fields with validation decorators

#### Scenario: Invalid request body is rejected with validation errors
- **WHEN** a request body fails DTO validation (e.g., missing required field, invalid type)
- **THEN** the endpoint SHALL return 400 Bad Request with a structured validation error response

#### Scenario: Request DTO decorators match existing validation rules
- **WHEN** request DTOs are compared to the existing Mongoose-era DTOs
- **THEN** all existing validation rules (max length, required fields, custom validators like `@IsPhoneNumber`, `@IsCloseTimeAfterOpenTime`) SHALL be preserved

### Requirement: Response DTOs for all endpoints

Every endpoint SHALL have a dedicated response DTO class that defines the exact shape of the JSON response, with `@ApiProperty()` decorators and `@Expose()`/`@Exclude()` decorators from `class-transformer`.

#### Scenario: Commercial response DTO matches existing API shape
- **WHEN** a commercial is fetched from the API
- **THEN** the response JSON SHALL match the existing API contract: `_id`, `name`, `category`, `location`, `imageUrl`, `opening`, `displayOpening`, `district`, `commercialOwner`, `phoneNumber`, `moreInfo`, `types`, `createdAt`, `updatedAt`, etc.

#### Scenario: Response DTO maps Prisma id to _id
- **WHEN** a Prisma model result with an `id` field is serialized through a response DTO
- **THEN** the response JSON SHALL contain `_id` (not `id`) for backward compatibility with existing clients

#### Scenario: Pagination response DTO matches existing shape
- **WHEN** a paginated endpoint returns results
- **THEN** the response SHALL match the existing `IPaginationResponse<T>` shape with `data` array and `metaData` object containing `perPage`, `count`, `prevPage`, `currentPage`, `nextPage`, `lastPage`

### Requirement: Swagger OpenAPI integration

All request and response DTOs SHALL be fully decorated with `@nestjs/swagger` decorators so that the generated OpenAPI spec accurately documents every endpoint.

#### Scenario: Swagger UI shows request body schema
- **WHEN** a developer views the Swagger UI for a POST endpoint
- **THEN** the request body schema SHALL show all fields with their types, required/optional status, and example values

#### Scenario: Swagger UI shows response schema
- **WHEN** a developer views the Swagger UI for any endpoint
- **THEN** the response schema SHALL show the exact DTO shape with all field types and descriptions

#### Scenario: Swagger documents error responses
- **WHEN** a developer views the Swagger UI for an endpoint
- **THEN** error responses (400, 401, 403, 404, 503) SHALL be documented with their error code references

### Requirement: Query DTOs for all GET list endpoints

Every GET endpoint that accepts query parameters SHALL have a dedicated query DTO class with validation and Swagger decorators.

#### Scenario: Get commercials query DTO with pagination
- **WHEN** a GET request is sent to list commercials
- **THEN** query parameters SHALL be validated against a DTO that extends pagination fields (`page`, `perPage`, `sortedBy`, `direction`) plus module-specific filters

#### Scenario: Get tiny commercials query DTO with geo filters
- **WHEN** a GET request is sent to the `/tiny` endpoint
- **THEN** query parameters SHALL be validated against a DTO that includes geospatial filter fields (district, category, working hour status)

### Requirement: Nested DTOs for complex structures

Complex nested structures (location, opening hours, contact info, amount with unit) SHALL have dedicated nested DTO classes reused across parent DTOs.

#### Scenario: Location nested DTO used in create commercial
- **WHEN** a commercial creation request includes location data
- **THEN** the `latitude` and `longitude` fields SHALL be validated by a nested `LocationDto` with `@IsLatitude()` and `@IsLongitude()` decorators

#### Scenario: Opening hours nested DTO validates time constraints
- **WHEN** a request includes opening hours
- **THEN** each `OpeningTimeDto` SHALL validate that `close` time is after `open` time using the `@IsCloseTimeAfterOpenTime()` custom validator

### Requirement: File upload DTOs

Endpoints that handle file uploads SHALL document the file parameter in Swagger using `@ApiConsumes('multipart/form-data')` and `@ApiBody` with file schema.

#### Scenario: Create commercial with image upload documented
- **WHEN** a developer views the Swagger UI for the create commercial endpoint
- **THEN** the documentation SHALL show that it accepts `multipart/form-data` with a file field for the main image
