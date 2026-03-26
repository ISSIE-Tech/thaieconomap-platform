## Context

The frontend drawer refetches route data every 1 second for live tracking. It should show only the current/latest route, not all historical sessions.

## Goals / Non-Goals

**Goals:**
- Frontend drawer shows only the latest route

**Non-Goals:**
- Showing historical routes (that's admin-only via the tracking page)

## Decisions

### Use first record only
**Decision**: Change `records.flatMap(r => r.history)` to `firstRecord.history` — the first record is the active Redis session (or most recent MongoDB record).
