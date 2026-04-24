## Purpose

Persist and query OTP request/verification results for developer visibility and debugging.
## Requirements
### Requirement: System logs every OTP request attempt
The system SHALL persist a log entry for every OTP request. Each log entry MUST contain:
- `phoneNumber`: The phone number the OTP was sent to
- `pumpuangId`: The pumpuang ID associated with the request
- `pumpuangName`: The pumpuang owner name at the time of the request
- `action`: `request` or `verify`
- `status`: `success` or `failure`
- `refno`: The reference number from ThaiBulkSMS (for request actions)
- `errorMessage`: The error message if status is `failure`, null otherwise

#### Scenario: OTP log includes pumpuang name
- **WHEN** an OTP log entry is created
- **THEN** the entry SHALL include the `pumpuangName` field with the pumpuang owner name at the time of the event

### Requirement: OTP logs are automatically expired
The system SHALL configure a TTL index on the `createdAt` field of the OTP logs collection. Logs older than 90 days SHALL be automatically removed by MongoDB.

#### Scenario: Log expiration
- **WHEN** an OTP log entry is older than 90 days
- **THEN** MongoDB SHALL automatically delete the entry via the TTL index

### Requirement: OTP logs are queryable via API
The system SHALL expose a `POST /otp/logs` endpoint that returns paginated OTP logs. The endpoint MUST support filtering by:
- `action` (request/verify)
- `status` (success/failure)
- `phoneNumber` (partial match)
- Date range (`from`/`to` timestamps)
The endpoint MUST be restricted to the `DEVELOPER` role.

#### Scenario: Query logs with filters
- **WHEN** a client sends `POST /otp/logs` with `{ "status": "failure", "action": "verify", "page": 1, "limit": 20 }`
- **THEN** the system SHALL return the first 20 failed verification logs, sorted by timestamp descending

#### Scenario: Query logs without filters
- **WHEN** a client sends `POST /otp/logs` with `{ "page": 1, "limit": 20 }`
- **THEN** the system SHALL return the 20 most recent OTP logs regardless of action or status

### Requirement: OTP Logs admin page
The admin dashboard OTP Logs page SHALL display pumpuang name instead of pumpuang ID in the table.

#### Scenario: Viewing OTP logs with name
- **WHEN** a developer opens the OTP Logs page
- **THEN** the table SHALL show a "Pumpuang Name" column instead of "Pumpuang ID"

