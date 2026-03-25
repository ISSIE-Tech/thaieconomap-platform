## Why

When a user clicks to open the pumpuang tracking drawer, the main map does not focus on the selected pumpuang's latest location, and there is no car icon marker showing the vehicle's current position on the embedded route history map inside the drawer. This makes it difficult for users to visually track where a pumpuang vehicle currently is.

## What Changes

- **Auto-focus main map**: When the pumpuang detail drawer opens, the main map should animate (`flyTo`) to the selected pumpuang's latest GPS coordinates.
- **Car icon on drawer map**: Add a car icon marker on the embedded route history map inside the detail drawer to indicate the vehicle's current real-time location. This marker should update as new location data arrives (every 1 second via the existing polling).
- **Car icon asset**: Add a car icon asset to `public/assets/icons/pumpuang/` for use as the current-location marker.

## Capabilities

### New Capabilities
- `pumpuang-current-location-marker`: Display a car icon on the detail drawer's embedded map showing the vehicle's real-time current location.

### Modified Capabilities
- None (no existing spec-level requirements are changing)

## Impact

- **Frontend components**: `pumpuang-detail-drawer.tsx`, `pumpuang-route-history.tsx`, `pumpuang-location-markers.tsx`
- **Assets**: New car icon PNG in `public/assets/icons/pumpuang/`
- **Dependencies**: No new dependencies required; uses existing Leaflet marker and `leaflet-rotatedmarker` capabilities
