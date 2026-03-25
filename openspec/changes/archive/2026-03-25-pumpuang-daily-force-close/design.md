## Context

The backend already has `autoCloseExpiredTracking` (runs every minute, checks per-pumpuang opening hours) and `stopPumpuangRiderTracking` (stops a single pumpuang). We need a daily hard cutoff at 23:50 that closes all remaining sessions.

## Goals / Non-Goals

**Goals:**
- All running pumpuang tracking sessions are force-closed at 23:50 daily
- Each affected pumpuang receives an FCM notification

**Non-Goals:**
- Changing the existing per-pumpuang auto-close logic
- Admin UI changes (this is purely backend)

## Decisions

### 1. Add cron method alongside existing auto-close
**Decision**: Add `forceCloseAllTrackingDaily` with `@Cron('50 23 * * *')` in the same `PumpuangsService`, following the same pattern as `autoCloseExpiredTracking`.

**Rationale**: The existing cron handles business-hours-based closure. This new cron is a safety net that runs once daily. Both can coexist — if the per-pumpuang cron already closed everything, the daily cron simply finds no running pumpuangs and exits early.

## Risks / Trade-offs

- **[Timezone]** The cron runs in the server's timezone. If the server is UTC and users are in Thailand (UTC+7), 23:50 server time ≠ 23:50 local time. **Mitigation**: Verify the existing cron uses the same timezone assumption. The `@Cron` decorator uses the server timezone by default; NestJS Schedule supports a `timeZone` option if needed.
