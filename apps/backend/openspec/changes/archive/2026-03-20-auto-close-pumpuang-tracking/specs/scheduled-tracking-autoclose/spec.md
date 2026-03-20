## ADDED Requirements

### Requirement: Cron job auto-closes RUNNING pumpuang tracking at closing time
The system SHALL run a scheduled cron job every minute that finds all pumpuangs with `RUNNING` status and checks whether their current day's last opening hour has passed. For each pumpuang whose closing time has passed, the system SHALL auto-close the tracking session by persisting the Redis location cache to MongoDB and setting the status to `INACTIVE`.

#### Scenario: Pumpuang is RUNNING and past closing time
- **WHEN** the cron job runs and a pumpuang has `status: RUNNING`
- **AND** the current time in minutes since midnight exceeds the last `close` value in today's `opening.hours`
- **THEN** the system SHALL persist the Redis location cache to MongoDB `PumpuangLocation` collection
- **AND** the system SHALL set the pumpuang status to `INACTIVE`
- **AND** the system SHALL delete the Redis cache key for that pumpuang

#### Scenario: Pumpuang is RUNNING but still within opening hours
- **WHEN** the cron job runs and a pumpuang has `status: RUNNING`
- **AND** the current time in minutes since midnight is less than or equal to the last `close` value in today's `opening.hours`
- **THEN** the system SHALL NOT close the tracking session
- **AND** the system SHALL NOT modify the pumpuang status or cache

#### Scenario: Pumpuang is RUNNING on a day with opening disabled
- **WHEN** the cron job runs and a pumpuang has `status: RUNNING`
- **AND** today's `opening.enable` is `false` or `opening.hours` is empty
- **THEN** the system SHALL auto-close the tracking session (persist cache and set `INACTIVE`)

#### Scenario: No pumpuangs are RUNNING
- **WHEN** the cron job runs and no pumpuangs have `status: RUNNING`
- **THEN** the system SHALL complete without errors and take no action

#### Scenario: Redis cache is empty for a RUNNING pumpuang
- **WHEN** the cron job auto-closes a pumpuang whose Redis cache key does not exist
- **THEN** the system SHALL still set the pumpuang status to `INACTIVE`
- **AND** the system SHALL NOT create an empty `PumpuangLocation` record in MongoDB
