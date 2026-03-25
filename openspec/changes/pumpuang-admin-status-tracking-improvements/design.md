## Context

The pumpuang admin dashboard was recently extended with CRUD and tracking history. Several gaps remain:
- The `status` field (RUNNING/INACTIVE) exists on the `Pumpuang` schema and is included in `PumpuangResponseDto`, but the admin frontend `PumpuangItem` type doesn't include it and the list table doesn't display it
- The `stopPumpuangRiderTracking` service method exists but is only exposed via the pumpuang mobile app endpoint (`POST /pumpuangs/app/tracking/stop`) behind `PumpuangJwtAccessGuard` — no admin endpoint exists
- The tracking page was created without the `DashboardContent` wrapper that all other pages use
- Opening hours are stored as integer minutes-since-midnight (e.g., 540 = 09:00) in the `Opening` schema's `OpeningTime` sub-schema, but the form treats them as raw strings

## Goals / Non-Goals

**Goals:**
- Admin can see tracking status in the pumpuang list table
- Admin can force-stop a running pumpuang's tracking
- Tracking page layout matches other dashboard pages
- Opening time conversion is correct and shared between create/edit forms
- Active tracking is clearly indicated on the tracking page

**Non-Goals:**
- Real-time status updates (polling/websocket) — page refresh is sufficient
- Fixing the commercial module's time conversion (separate concern)
- Changing how the backend stores opening times

## Decisions

### 1. New admin endpoint for force-stop
**Decision**: Add `POST /pumpuangs/:pumpuangId/force-stop` in `PumpuangsController` with `@ExcludeRoles(UserRole.CUSTOMER)` guard, reusing the existing `stopPumpuangRiderTracking` service method.

**Rationale**: The stop logic already exists and works correctly (flushes Redis cache to MongoDB, sets status to INACTIVE). We just need to expose it to admin users. Using the same service method prevents duplication.

**Alternative considered**: Adding a generic status update endpoint — rejected because force-stop has specific side effects (cache flush, FCM notification) that a simple PATCH wouldn't capture.

### 2. Shared time transform utilities
**Decision**: Create `minutesToTimeString(minutes: number): string` and `timeStringToMinutes(time: string): number` in a shared utils file at `src/modules/economap/_utils/time-transform.ts`.

**Rationale**: Both pumpuang and commercial modules need this conversion. Placing it in the economap shared utils prevents duplication. The backend stores `open: 540, close: 1020` which means 09:00 and 17:00 respectively (hours * 60 + minutes).

### 3. Tracking page wrapped in DashboardContent
**Decision**: Update the tracking page component to use `DashboardContent` with `CustomBreadcrumbs`, matching the list page pattern.

**Rationale**: All other dashboard pages use this wrapper for consistent padding, max-width, and navigation context.

## Risks / Trade-offs

- **[Force-stop side effects]** Force-stopping a pumpuang that's actively sending locations may cause a brief inconsistency if the app sends a location update after the force-stop. **Mitigation**: The backend tracking endpoint already checks `status === RUNNING` before accepting locations, so it will reject post-stop updates gracefully.
- **[Cache miss on force-stop]** If Redis has no cached location for a "running" pumpuang (e.g., after Redis restart), `deletePumpuangLocationFromCache` handles null gracefully (returns early). The status update still works.
