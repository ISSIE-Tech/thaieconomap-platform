## Context

Pumpuang tracking sessions are started by riders and tracked via location updates stored in Redis. Sessions close when the rider manually stops or when a location update arrives after closing time. However, if no location update is sent after closing time, the session remains `RUNNING` indefinitely — stale in Redis with no persistence to MongoDB.

The `NotificationsModule` (FCM) is already imported in `PumpuangsModule` and provides `NotificationService.sendToPumpuang(pumpuangId, title, body, data?)` which looks up device tokens and sends via Firebase.

Each pumpuang has `opening: Opening[]` (7 days, indexed by day of week) with `hours: OpeningTime[]` where each slot has `open` and `close` as minutes since midnight.

## Goals / Non-Goals

**Goals:**
- Auto-close RUNNING tracking sessions at their scheduled closing time without requiring a location update
- Persist Redis location cache to MongoDB on auto-close (same as manual stop)
- Send FCM push notification to pumpuang owner when tracking is auto-closed
- Send FCM push notification to pumpuang owner when rider starts sending location (first location of session)

**Non-Goals:**
- Changing the existing manual stop or location-triggered close flows
- Adding new API endpoints
- Handling edge cases like mid-day opening hour gaps (existing logic already handles multiple hour slots)

## Decisions

### 1. Cron job in PumpuangsService (not CachingService)

Place the cron job in `PumpuangsService` since it directly uses pumpuang tracking logic (`stopPumpuangRiderTracking`, `deletePumpuangLocationFromCache`) and needs access to `PumpuangRepository` and the Redis client.

**Alternative considered:** Separate service or CachingService — rejected because it would require exposing private methods or duplicating logic, and CachingService is for shop/base cache unrelated to tracking.

### 2. Cron interval: every minute

Run the cron every minute (`CronExpression.EVERY_MINUTE`). Opening hours are defined in minute granularity, so checking every minute ensures sessions close within ~1 minute of their scheduled close time.

**Alternative considered:** Every 5 minutes — acceptable latency but less precise. Every 30 seconds — unnecessary overhead for minute-granularity close times.

### 3. Query: find all RUNNING pumpuangs, filter by opening hours in code

The cron queries `pumpuangRepository` for all pumpuangs with `status: RUNNING`, then checks each one's `opening[today].hours` to see if current time is past the last closing time. This is simple and the number of RUNNING pumpuangs at any time should be small.

**Alternative considered:** Store explicit `scheduledCloseAt` timestamp on start — adds schema complexity for little benefit given small RUNNING count.

### 4. Reuse existing stop logic

Call `stopPumpuangRiderTracking()` (or its underlying methods) for each auto-closed pumpuang. This ensures the same Redis-to-MongoDB persistence and status update happens.

### 5. First-location notification via flag in Redis cache

To detect the first location of a tracking session, check if the Redis cache key exists before writing. If it doesn't exist (first location), send the notification. This avoids adding a schema field — the absence of the cache key is the signal.

**Alternative considered:** Add a `notifiedStart: boolean` field to pumpuang schema — rejected as over-engineering for a transient state.

### 6. Fire-and-forget notifications

Notifications are sent asynchronously without awaiting or failing the main operation. If FCM fails, the tracking operation still completes. This matches existing FCM service behavior (errors are logged, not thrown).

## Risks / Trade-offs

- **[Race condition]** A location update and the cron could both try to close the same session simultaneously → **Mitigation**: `deletePumpuangLocationFromCache` already handles the case where cache doesn't exist (returns early). The status update is idempotent (`INACTIVE` → `INACTIVE` is a no-op). Duplicate notifications are possible but acceptable.

- **[Cron not running]** If the server is down at closing time, auto-close won't happen → **Mitigation**: The existing location-triggered close still works as a fallback. The cron will also catch these on next startup if sessions are still RUNNING past close time.

- **[Notification spam on restart]** If multiple pumpuangs are RUNNING when cron first runs → **Mitigation**: This is correct behavior — each should be notified that their session was auto-closed.

- **[First-location detection false positive]** If Redis cache was evicted but session is still RUNNING → **Mitigation**: Redis cache TTL is currently disabled (commented out), so eviction only happens on explicit delete or server restart. Acceptable edge case.
