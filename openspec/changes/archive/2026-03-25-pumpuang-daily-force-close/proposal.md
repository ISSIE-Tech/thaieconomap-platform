## Why

The existing `autoCloseExpiredTracking` cron checks each pumpuang's individual opening hours to decide whether to close tracking. However, some pumpuangs may have misconfigured hours or no closing time set, causing their tracking to remain open indefinitely. A hard daily cutoff at 23:50 ensures no tracking session persists past the end of the day.

## What Changes

- Add a new cron job `forceCloseAllTracking` scheduled at 23:50 daily that stops all currently running pumpuang tracking sessions unconditionally
- Reuse existing `stopPumpuangRiderTracking` logic (flush Redis cache to MongoDB, set status to INACTIVE)
- Send FCM notification to each affected pumpuang

## Capabilities

### New Capabilities
- `pumpuang-daily-force-close`: Cron job that force-closes all running pumpuang tracking sessions at 23:50 every day

### Modified Capabilities

## Impact

- **Backend** (`apps/backend`): New cron method in `PumpuangsService`, no new endpoints or schema changes
