## MODIFIED Requirements

### Requirement: System logs every FCM notification send attempt
The system SHALL persist a log entry for every FCM notification send attempt. Each log entry MUST contain:
- `sendTo`: The recipient identifier (device token, pumpuang ID, or topic name)
- `pumpuangName`: The pumpuang owner name if applicable, null otherwise
- `status`: `success` or `failure`
- `reason`: Why the notification was sent (e.g., "manual test", "tracking update", "announcement", "open-time-reminder", "close-time-reminder", "close-time-reminder-followup")
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

#### Scenario: Open-time reminder notification logged
- **WHEN** the system sends an open-time reminder notification to a pumpuang
- **THEN** the system SHALL create log entries with reason `open-time-reminder`

#### Scenario: Close-time reminder notification logged
- **WHEN** the system sends a close-time reminder notification to a pumpuang
- **THEN** the system SHALL create log entries with reason `close-time-reminder`

#### Scenario: Close-time follow-up notification logged
- **WHEN** the system sends a close-time follow-up reminder notification to a pumpuang
- **THEN** the system SHALL create log entries with reason `close-time-reminder-followup`
