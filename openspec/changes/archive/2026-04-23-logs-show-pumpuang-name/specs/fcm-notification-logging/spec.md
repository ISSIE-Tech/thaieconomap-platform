## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: FCM Logs page displays notification history
The FCM Logs page SHALL display a "Pumpuang Name" column in the notification log table.

#### Scenario: Viewing FCM logs with name
- **WHEN** a developer opens the FCM Logs page
- **THEN** the table SHALL show a "Pumpuang Name" column, displaying the name or "-" for topic notifications
