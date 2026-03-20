## ADDED Requirements

### Requirement: Push notification when rider starts sending location
The system SHALL send an FCM push notification to the pumpuang owner when the first location update of a tracking session is received. The notification SHALL be fire-and-forget — failures MUST NOT affect the location tracking operation.

#### Scenario: First location update of a tracking session
- **WHEN** a location update is received for a pumpuang with `status: RUNNING`
- **AND** no Redis cache key exists for that pumpuang's location (indicating this is the first location of the session)
- **AND** the current time is within opening hours
- **THEN** the system SHALL send an FCM push notification to the pumpuang owner with a message indicating the rider has started sending location
- **AND** the system SHALL proceed with normal location tracking (store in Redis)

#### Scenario: Subsequent location updates in the same session
- **WHEN** a location update is received for a pumpuang with `status: RUNNING`
- **AND** a Redis cache key already exists for that pumpuang's location
- **THEN** the system SHALL NOT send a start notification
- **AND** the system SHALL proceed with normal location tracking

#### Scenario: FCM send fails on first location
- **WHEN** a first-location notification fails to send (FCM error, no device tokens, etc.)
- **THEN** the system SHALL log the error
- **AND** the system SHALL still proceed with storing the location in Redis
- **AND** the error SHALL NOT propagate to the caller

### Requirement: Push notification when tracking is auto-closed
The system SHALL send an FCM push notification to the pumpuang owner when their tracking session is auto-closed by the scheduled cron job. The notification SHALL be fire-and-forget — failures MUST NOT prevent the auto-close operation from completing.

#### Scenario: Tracking session auto-closed by cron
- **WHEN** the cron job determines a pumpuang's tracking session should be auto-closed
- **THEN** the system SHALL send an FCM push notification to the pumpuang owner with a message indicating their tracking was automatically closed because the closing time was reached
- **AND** the system SHALL proceed with the auto-close operation (persist cache, set INACTIVE)

#### Scenario: FCM send fails during auto-close
- **WHEN** the auto-close notification fails to send
- **THEN** the system SHALL log the error
- **AND** the system SHALL still complete the auto-close operation (persist cache, set INACTIVE)

#### Scenario: Pumpuang has no registered device tokens
- **WHEN** an auto-close or first-location notification is triggered for a pumpuang with no registered device tokens
- **THEN** the system SHALL skip the send silently (per existing FCM service behavior)
- **AND** the tracking operation SHALL proceed normally
