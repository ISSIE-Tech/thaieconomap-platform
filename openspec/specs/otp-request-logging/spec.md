## Purpose

Persist and query OTP request/verification results for developer visibility and debugging.

## Requirements

### Requirement: System logs every OTP request attempt
The system SHALL persist a log entry for every OTP request. Each log entry MUST contain:
- `phoneNumber`: The phone number the OTP was sent to
- `pumpuangId`: The pumpuang ID associated with the request
- `action`: `request` or `verify`
- `status`: `success` or `failure`
- `refno`: The reference number from ThaiBulkSMS (for request actions)
- `errorMessage`: The error message if status is `failure`, null otherwise

#### Scenario: Successful OTP request
- **WHEN** a pumpuang requests an OTP and ThaiBulkSMS returns successfully
- **THEN** the system SHALL create a log entry with action `request`, status `success`, and the refno from the response

#### Scenario: Failed OTP request
- **WHEN** a pumpuang requests an OTP and ThaiBulkSMS returns an error
- **THEN** the system SHALL create a log entry with action `request`, status `failure`, and the error message

#### Scenario: Successful OTP verification
- **WHEN** a pumpuang verifies an OTP and ThaiBulkSMS confirms the PIN is correct
- **THEN** the system SHALL create a log entry with action `verify`, status `success`

#### Scenario: Failed OTP verification
- **WHEN** a pumpuang verifies an OTP and ThaiBulkSMS rejects the PIN
- **THEN** the system SHALL create a log entry with action `verify`, status `failure`, and the error message

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
The admin dashboard SHALL include an "OTP Logs" page under the developer navigation section. The page SHALL display a table with columns: Phone Number, Pumpuang ID, Action, Status (with chip indicator), Ref No, Error Message, Timestamp. The table MUST support pagination, filtering by action and status, and search by phone number.

#### Scenario: Viewing OTP logs
- **WHEN** a developer opens the OTP Logs page
- **THEN** the page SHALL display the most recent OTP logs in a paginated table, sorted by timestamp descending

#### Scenario: Filtering by failed verifications
- **WHEN** a developer selects "verify" action and "failure" status filters
- **THEN** the table SHALL show only failed verification log entries
