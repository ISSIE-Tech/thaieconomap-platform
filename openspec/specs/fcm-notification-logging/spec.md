## Purpose

Persist and query FCM notification send results for operational visibility and debugging.

## Requirements

### Requirement: System logs every FCM notification send attempt
The system SHALL persist a log entry for every FCM notification send attempt. Each log entry MUST contain:
- `sendTo`: The recipient identifier (device token, pumpuang ID, or topic name)
- `status`: `success` or `failure`
- `reason`: Why the notification was sent (e.g., "manual test", "tracking update", "announcement")
- `errorMessage`: The error message if status is `failure`, null otherwise
- `timestamp`: The UTC time when the notification was sent

#### Scenario: Successful single-device notification
- **WHEN** FcmService sends a notification to a single device and it succeeds
- **THEN** the system SHALL create a log entry with status `success`, the device token as `sendTo`, and `errorMessage` as null

#### Scenario: Failed single-device notification
- **WHEN** FcmService sends a notification to a single device and it fails
- **THEN** the system SHALL create a log entry with status `failure`, the device token as `sendTo`, and the Firebase error message in `errorMessage`

#### Scenario: Multicast notification with partial failures
- **WHEN** FcmService sends a notification to multiple devices and some succeed while others fail
- **THEN** the system SHALL create one log entry per device, each with its own status and error message

#### Scenario: Topic notification
- **WHEN** FcmService sends a notification to a topic
- **THEN** the system SHALL create a log entry with the topic name as `sendTo`

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
