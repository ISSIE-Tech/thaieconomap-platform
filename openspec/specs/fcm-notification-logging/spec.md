## Purpose

Persist and query FCM notification send results for operational visibility and debugging.
## Requirements
### Requirement: System logs every FCM notification send attempt
The system SHALL persist a log entry for every FCM notification send attempt. Each log entry MUST contain:
- `sendTo`: The recipient identifier (device token, pumpuang ID, or topic name)
- `pumpuangName`: The pumpuang owner name (null for topic notifications)
- `status`: `success` or `failure`
- `reason`: Why the notification was sent
- `errorMessage`: The error message if status is `failure`, null otherwise

#### Scenario: FCM log includes pumpuang name
- **WHEN** an FCM notification is sent to a pumpuang's device
- **THEN** the log entry SHALL include the `pumpuangName` field with the pumpuang owner name

#### Scenario: FCM topic log has no pumpuang name
- **WHEN** an FCM notification is sent to a topic
- **THEN** the log entry SHALL have `pumpuangName` as null

### Requirement: Notification logs are automatically expired
The system SHALL configure a TTL index on the `createdAt` field of the notification logs collection. Logs older than 90 days SHALL be automatically removed by MongoDB.

#### Scenario: Log expiration
- **WHEN** a notification log entry is older than 90 days
- **THEN** MongoDB SHALL automatically delete the entry via the TTL index

### Requirement: Notification logs are queryable via API
The system SHALL expose a `GET /notifications/logs` endpoint that returns paginated notification logs. The endpoint MUST support filtering by:
- `status` (success/failure)
- `sendTo` (partial match)
- Date range (`from`/`to` timestamps)

#### Scenario: Query logs with filters
- **WHEN** a client sends `GET /notifications/logs?status=failure&from=2026-01-01&to=2026-01-31&page=1&limit=20`
- **THEN** the system SHALL return the first 20 failure logs from January 2026, sorted by timestamp descending

#### Scenario: Query logs without filters
- **WHEN** a client sends `GET /notifications/logs?page=1&limit=20`
- **THEN** the system SHALL return the 20 most recent logs regardless of status

### Requirement: FCM Logs page displays notification history
The FCM Logs page SHALL display a "Pumpuang Name" column in the notification log table.

#### Scenario: Viewing FCM logs with name
- **WHEN** a developer opens the FCM Logs page
- **THEN** the table SHALL show a "Pumpuang Name" column, displaying the name or "-" for topic notifications

