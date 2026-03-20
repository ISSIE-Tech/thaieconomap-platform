## Why

Pumpuang tracking sessions currently only close when: (1) the user manually stops tracking, or (2) a location update arrives after the closing time. If a rider forgets to stop tracking and no more location updates are sent, the session stays in `RUNNING` state indefinitely — leaving stale data in Redis and an inaccurate status. We need a scheduled mechanism to auto-close tracking at the designated closing time, persist the cached data, and notify the pumpuang owner via push notification. Additionally, pumpuang owners have no visibility into when their rider begins sending location data — a notification at tracking start would help them stay informed.

## What Changes

- Add a cron job that runs periodically (e.g., every minute) to find all pumpuangs with `RUNNING` status whose opening hours have ended for the current day
- Auto-close those tracking sessions: persist Redis location cache to MongoDB `PumpuangLocation`, set status back to `INACTIVE`
- Send an FCM push notification to the pumpuang owner when their tracking session is auto-closed, so they know it happened without manual action
- Send an FCM push notification to the pumpuang owner when their rider starts sending location data (first location update of a tracking session)
- Reuse existing `stopPumpuangRiderTracking()` and `deletePumpuangLocationFromCache()` logic for the close operation
- Reuse existing FCM push notification infrastructure for sending notifications

## Capabilities

### New Capabilities

- `scheduled-tracking-autoclose`: Cron-based job that detects RUNNING pumpuangs past their closing time and auto-closes them with data persistence and push notification
- `tracking-notifications`: FCM push notifications for tracking lifecycle events — notify pumpuang owner when rider starts sending location and when tracking is auto-closed

### Modified Capabilities

_(none — existing close logic is reused, not changed)_

## Impact

- **Services**: `pumpuang.service.ts` — new scheduled method or dedicated service for the cron job
- **FCM integration**: Leverages existing FCM push notification service to notify pumpuang owners on auto-close
- **Redis → MongoDB**: Same persistence flow as manual stop, no schema changes
- **Caching service**: May add new cron schedule alongside existing daily cache update
- **No API changes**: This is a backend-only scheduled task, no new endpoints
- **No breaking changes**: Existing manual close and location-triggered close continue to work as before
