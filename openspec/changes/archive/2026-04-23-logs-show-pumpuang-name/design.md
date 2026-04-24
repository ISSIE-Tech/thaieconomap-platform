## Context

OTP logs store `pumpuangId` and FCM logs store `sendTo` (device token). Neither directly shows the pumpuang owner name. The pumpuang name is available at the time logging occurs — in `PumpuangsService` for OTP (has the pumpuang document) and in `NotificationService.sendToPumpuang` for FCM (looks up by pumpuangId).

## Goals / Non-Goals

**Goals:**
- Store pumpuang owner name in both OTP and FCM log entries at creation time
- Display name instead of ID in the admin log tables

**Non-Goals:**
- Keeping names in sync if pumpuang is renamed (denormalized snapshot is fine for logs)
- Adding name to topic-based FCM logs (topics don't have a pumpuang)

## Decisions

### Denormalized name vs. join/lookup on read

**Decision**: Store `pumpuangName` directly in the log document.

**Rationale**: Logs are immutable records of what happened at a point in time. A denormalized name avoids expensive joins on paginated queries and preserves the name as it was when the event occurred. This is the same approach used by audit logs in general.

## Risks / Trade-offs

- **Stale names** → Acceptable for logs — they capture the state at event time.
- **FCM logs without pumpuang context** → Topic notifications and direct token sends won't have a name. Field is optional, UI shows "-" when null.
