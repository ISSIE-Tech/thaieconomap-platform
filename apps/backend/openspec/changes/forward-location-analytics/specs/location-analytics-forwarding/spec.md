## ADDED Requirements

### Requirement: Forward location data to analytics service on each tracking update
The system SHALL send an HTTP POST request to the configured analytics webhook URL each time a pumpuang location update is successfully processed and stored in Redis. The forwarding SHALL be asynchronous and SHALL NOT block or delay the tracking response.

#### Scenario: Successful analytics forwarding
- **WHEN** a pumpuang rider sends a location update and the update is successfully stored in Redis
- **THEN** the system sends an HTTP POST to `ANALYTICS_WEBHOOK_URL/api/webhook/location` with `Content-Type: application/json` and `X-Api-Key` header set to `ANALYTICS_WEBHOOK_API_KEY`
- **AND** the payload SHALL contain `service` set to `"pumm-puang"`, `trackerId` set to the pumpuang `_id`, and `location` containing the full location object from the incoming DTO

#### Scenario: Location update not stored (status not RUNNING or outside opening hours)
- **WHEN** a pumpuang rider sends a location update but the update is not stored (e.g., status is not RUNNING, outside opening hours)
- **THEN** the system SHALL NOT forward any data to the analytics service

### Requirement: Analytics forwarding failure SHALL NOT affect tracking
The system SHALL catch and log all errors from the analytics HTTP call. A failure in analytics forwarding MUST NOT cause the tracking endpoint to return an error or delay its response.

#### Scenario: Analytics service is unreachable
- **WHEN** the analytics HTTP POST fails due to network error or timeout
- **THEN** the system logs a warning with the error details
- **AND** the tracking endpoint returns the normal success response to the caller

#### Scenario: Analytics service returns a non-2xx status
- **WHEN** the analytics HTTP POST returns a non-2xx HTTP status code
- **THEN** the system logs a warning with the status code and response
- **AND** the tracking endpoint returns the normal success response to the caller

### Requirement: Analytics forwarding is configured via environment variables
The system SHALL read `ANALYTICS_WEBHOOK_URL` and `ANALYTICS_WEBHOOK_API_KEY` from environment variables. Both MUST be present for forwarding to be enabled.

#### Scenario: Both environment variables are set
- **WHEN** `ANALYTICS_WEBHOOK_URL` and `ANALYTICS_WEBHOOK_API_KEY` are both configured
- **THEN** analytics forwarding is enabled and location updates are forwarded

#### Scenario: One or both environment variables are missing
- **WHEN** `ANALYTICS_WEBHOOK_URL` or `ANALYTICS_WEBHOOK_API_KEY` is not set
- **THEN** analytics forwarding is disabled and no HTTP calls are made
- **AND** the system logs an info message on startup indicating analytics forwarding is disabled

### Requirement: Analytics HTTP call SHALL have a timeout
The system SHALL set a maximum timeout of 5 seconds on the outbound HTTP request to the analytics service.

#### Scenario: Analytics service responds slowly
- **WHEN** the analytics service takes longer than 5 seconds to respond
- **THEN** the request is aborted and a warning is logged
