## Context

The frontend pumpuang drawer shows a live map with the pumpuang's current location marker and route polylines. It fetches `GET /pumpuangs/:id/route` every 1 second. The backend now returns `PumpuangDayHistory[]` (array) instead of `PumpuangDayHistory` (single object).

## Goals / Non-Goals

**Goals:**
- Restore the pumpuang route/tracking path display in the frontend drawer
- Use the first record for current location (active tracking from Redis)
- Flatten all records' history for complete polyline display

**Non-Goals:**
- Changing the backend response format (it's correct for admin needs)
- Adding historical session browsing to the frontend (that's admin-only)

## Decisions

### 1. Take first record for current location, flatten history
**Decision**: Use `data[0]` for `current` (location marker), and `data.flatMap(r => r.history)` for all route polylines.

**Rationale**: The backend returns active Redis session first (if exists), then MongoDB records sorted by `createdAt` desc. The first record's `current` is the most up-to-date position. All records' history should be shown as polylines for the complete route.
