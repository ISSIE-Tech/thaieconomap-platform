## Why

The previous fix changed `getPumpuangRouteById` to flatten ALL historical route records into polylines. This causes the frontend pumpuang drawer to display every past tracking session's route, cluttering the map. The drawer is for live tracking — it should only show the latest/active route.

## What Changes

- Change `getPumpuangRouteById` to use only the first record's history (latest/active session) instead of flattening all records

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- **Frontend app** (`apps/frontend`): One-line change in `pumpuangs.service.ts`
