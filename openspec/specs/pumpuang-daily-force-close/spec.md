# pumpuang-daily-force-close Specification

## Purpose
TBD - created by archiving change pumpuang-daily-force-close. Update Purpose after archive.
## Requirements
### Requirement: Daily force-close all tracking at 23:50
The system SHALL run a cron job at 23:50 every day (Thailand timezone, Asia/Bangkok) that force-closes all pumpuang tracking sessions with status RUNNING. Each session SHALL be stopped using the existing stop logic (flush Redis cache to MongoDB, set status to INACTIVE). Each affected pumpuang SHALL receive an FCM notification.

#### Scenario: Running pumpuangs exist at 23:50
- **WHEN** the daily cron fires at 23:50 and there are pumpuangs with status RUNNING
- **THEN** the system SHALL stop each one's tracking, persist location data to MongoDB, set status to INACTIVE, and send FCM notification

#### Scenario: No running pumpuangs at 23:50
- **WHEN** the daily cron fires at 23:50 and no pumpuangs have status RUNNING
- **THEN** the system SHALL exit early without errors

