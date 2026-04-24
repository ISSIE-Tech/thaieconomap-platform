## Context

The pumpuang system currently has two cron-based tracking mechanisms:
1. `autoCloseExpiredTracking()` — runs every minute, auto-stops tracking after the last closing hour.
2. `forceCloseAllTrackingDaily()` — runs at 23:50 Bangkok time, force-stops all remaining tracking.

There are no proactive reminders at open/close time. Riders only receive notifications reactively (when auto-close triggers). This change adds open-time and close-time notifications to prompt riders to start/stop location tracking voluntarily.

Operating hours are stored per pumpuang as `opening[7]` (one per day of week), where each day has `enable: boolean` and `hours: OpeningTime[]` with `open`/`close` as minutes since midnight.

## Goals / Non-Goals

**Goals:**
- Send FCM notification to each pumpuang at their configured open time asking to start sending location.
- Send FCM notification at close time asking to stop tracking.
- Send one follow-up close-time reminder 1 hour after close if still tracking.
- Prevent duplicate notifications on each cron tick using Redis state tracking.

**Non-Goals:**
- Changing auto-close behavior (existing `autoCloseExpiredTracking` remains unchanged).
- Handling multiple open/close windows differently (use first open time and last close time for the day).
- Notifications for pumpuangs without device tokens (no-op, handled by existing `sendToPumpuang`).
- Admin UI changes for this feature.

## Decisions

### 1. Cron approach: extend existing service vs. new service

**Decision:** Add new cron methods to `PumpuangsService` alongside existing cron jobs.

**Rationale:** The service already owns the pumpuang cron lifecycle (`autoCloseExpiredTracking`, `forceCloseAllTrackingDaily`), has all required dependencies injected, and adding methods here keeps the notification logic co-located. A separate service would require duplicating injections for minimal separation benefit.

**Alternative considered:** Dedicated `PumpuangNotificationSchedulerService` — rejected as over-engineering for 2 new cron methods.

### 2. Duplicate prevention: Redis keys with TTL

**Decision:** Use Redis keys to track notification state per pumpuang per day.

Key format:
- `pumpuang:notif:open:{pumpuangId}:{YYYY-MM-DD}` — set when open-time notification sent, TTL 24h
- `pumpuang:notif:close:{pumpuangId}:{YYYY-MM-DD}` — set when first close-time notification sent, TTL 24h
- `pumpuang:notif:close-followup:{pumpuangId}:{YYYY-MM-DD}` — set when follow-up sent, TTL 24h

**Rationale:** Redis is already used extensively in this service (injected as `REDIS_CLIENT`). Keys auto-expire, no cleanup needed. Fast check on every cron tick. Date suffix ensures daily reset.

**Alternative considered:** MongoDB collection for notification state — rejected, too heavy for ephemeral daily state.

### 3. Which pumpuangs receive open-time notifications

**Decision:** Query ALL pumpuangs (not just RUNNING) with `submissionStatus: ACCEPTED` that have today's opening enabled and a matching open time.

**Rationale:** The open-time notification is meant to prompt riders who haven't started yet. Only querying RUNNING pumpuangs would miss the entire target audience.

### 4. Which pumpuangs receive close-time notifications

**Decision:** Query only RUNNING pumpuangs whose last close time for today matches.

**Rationale:** Close-time reminders only make sense for riders who are actively tracking. Non-running pumpuangs don't need a "stop" reminder.

### 5. Cron frequency

**Decision:** Use `EVERY_MINUTE` (same as `autoCloseExpiredTracking`).

**Rationale:** Open/close times are stored as integer minutes since midnight. Checking every minute ensures we catch the exact minute. Redis dedup keys prevent re-sends.

### 6. Time matching tolerance

**Decision:** Match when `currentMinutes === openTime` (or `closeTime` / `closeTime + 60`). Exact minute match only.

**Rationale:** Since the cron runs every minute and times are stored as integer minutes, exact equality is sufficient and deterministic. A range would risk sending at wrong times or double-sending.

## Risks / Trade-offs

- **[Cron tick missed]** → If the server restarts and misses the exact minute, the notification won't be sent. Acceptable since this is a convenience reminder, not a critical operation. Mitigation: the existing auto-close still handles the tracking stop.
- **[Redis unavailability]** → If Redis is down, dedup keys can't be checked. Mitigation: wrap in try-catch; skip notification send rather than spam on failure. The service already depends on Redis for core functionality.
- **[Many pumpuangs at same time]** → If many pumpuangs share the same open/close time, the cron could take longer. Mitigation: use `Promise.allSettled` for concurrent FCM sends within each tick, similar to the fire-and-forget pattern already used.
