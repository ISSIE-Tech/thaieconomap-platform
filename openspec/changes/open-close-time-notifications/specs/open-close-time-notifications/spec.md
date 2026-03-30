## ADDED Requirements

### Requirement: System sends open-time notification to pumpuang riders
The system SHALL send an FCM notification to each accepted pumpuang at their configured first open time for the current day (Bangkok timezone). The notification MUST prompt the rider to start sending their location. The system SHALL only send this notification once per pumpuang per day.

#### Scenario: Open time matches current time
- **WHEN** the cron job runs and the current minute (Bangkok time) equals a pumpuang's first `open` time for today, AND today's opening is enabled, AND no open-time notification has been sent to this pumpuang today
- **THEN** the system SHALL send an FCM notification to all device tokens of that pumpuang with a message prompting them to start location tracking, AND mark the open-time notification as sent for today

#### Scenario: Open time already notified
- **WHEN** the cron job runs and the current minute equals a pumpuang's open time, BUT an open-time notification has already been sent today
- **THEN** the system SHALL NOT send another open-time notification

#### Scenario: Today's opening is disabled
- **WHEN** the cron job runs and today's opening `enable` is false for a pumpuang
- **THEN** the system SHALL NOT send any open-time notification to that pumpuang

#### Scenario: Pumpuang has no device tokens
- **WHEN** the cron job attempts to send an open-time notification but the pumpuang has no registered device tokens
- **THEN** the system SHALL skip the notification without error (handled by existing sendToPumpuang)

### Requirement: System sends close-time notification to tracking pumpuang riders
The system SHALL send an FCM notification to each pumpuang that has status RUNNING when the current minute (Bangkok timezone) equals their last `close` time for today. The notification MUST prompt the rider to stop sending their location. The system SHALL only send this notification once per pumpuang per day.

#### Scenario: Close time matches current time for running pumpuang
- **WHEN** the cron job runs and the current minute equals a running pumpuang's last `close` time for today, AND no close-time notification has been sent to this pumpuang today
- **THEN** the system SHALL send an FCM notification prompting the rider to stop location tracking, AND mark the close-time notification as sent for today

#### Scenario: Close time matches but pumpuang is not running
- **WHEN** the cron job runs and the current minute equals a pumpuang's close time, BUT the pumpuang status is not RUNNING
- **THEN** the system SHALL NOT send a close-time notification

#### Scenario: Close time already notified
- **WHEN** the cron job runs and the current minute equals a pumpuang's close time, BUT a close-time notification has already been sent today
- **THEN** the system SHALL NOT send another close-time notification

### Requirement: System sends close-time follow-up notification 1 hour after close
The system SHALL send a second FCM notification to each pumpuang that is still RUNNING 1 hour (60 minutes) after their last close time. This is the final reminder — no further close-related notifications SHALL be sent after this.

#### Scenario: One hour after close time with pumpuang still running
- **WHEN** the cron job runs and the current minute equals a running pumpuang's last `close` time + 60 minutes, AND a close-time notification was already sent, AND no follow-up notification has been sent today
- **THEN** the system SHALL send a follow-up FCM notification to that pumpuang, AND mark the follow-up as sent for today

#### Scenario: One hour after close but pumpuang already stopped
- **WHEN** the current minute equals close time + 60 minutes, BUT the pumpuang is no longer RUNNING
- **THEN** the system SHALL NOT send a follow-up notification

#### Scenario: Follow-up already sent
- **WHEN** the current minute equals close time + 60 minutes, BUT the follow-up notification has already been sent today
- **THEN** the system SHALL NOT send another follow-up notification

### Requirement: Notification dedup state is stored in Redis with daily TTL
The system SHALL use Redis keys to track which notifications have been sent per pumpuang per day. Each key SHALL have a 24-hour TTL to automatically reset daily.

#### Scenario: Redis key set on notification send
- **WHEN** the system successfully sends an open-time, close-time, or follow-up notification
- **THEN** the system SHALL set a Redis key specific to that pumpuang, notification type, and current date with a 24-hour TTL

#### Scenario: Redis key checked before sending
- **WHEN** the cron job evaluates whether to send a notification
- **THEN** the system SHALL check the corresponding Redis key and skip sending if the key exists

#### Scenario: Redis unavailable during check
- **WHEN** Redis is unavailable when checking or setting notification state
- **THEN** the system SHALL log the error and skip the notification send (fail-safe to avoid spam)
