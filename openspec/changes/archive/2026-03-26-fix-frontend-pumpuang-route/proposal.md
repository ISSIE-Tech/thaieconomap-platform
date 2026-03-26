## Why

The backend `GET /pumpuangs/:id/route` was changed to return an **array** of route records (to support viewing all historical tracking sessions in admin). The frontend app's `getPumpuangRouteById` still expects a single object, causing `Cannot destructure property 'current' of undefined` — the pumpuang tracking path/route display in the drawer is broken.

## What Changes

- Fix `getPumpuangRouteById` in the frontend app to handle the array response
- For the live tracking drawer, use the first record (active Redis session) for current location and route display
- Merge all records' history for complete route polyline display

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- **Frontend app** (`apps/frontend`): Fix `pumpuangs.service.ts` to handle array response from route endpoint
