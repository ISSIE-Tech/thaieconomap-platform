## Context

The pumpuang tracking feature uses a Leaflet map (`react-leaflet`) with real-time polling every 1 second via `useGetTinyPumpuangs`. When a user clicks a pumpuang marker on the main map, a detail drawer opens on the right side containing vehicle info and an embedded route history map.

Currently:
- The main map uses `map.flyTo()` when clicking a marker, but this may not consistently trigger when the drawer opens.
- The embedded route history map inside the drawer does not display a car icon at the vehicle's current location — it only shows the route polyline.

Key files:
- `pumpuang-location-markers.tsx` — main map marker logic with flyTo
- `pumpuang-detail-drawer.tsx` — drawer component
- `pumpuang-route-history.tsx` — embedded map with route visualization

## Goals / Non-Goals

**Goals:**
- Main map flies to the selected pumpuang's latest coordinates when the detail drawer opens
- Embedded route history map shows a car icon marker at the vehicle's current location
- Car icon updates in real-time as new location data arrives

**Non-Goals:**
- Changing the main map's pumpuang markers (they keep existing left/right icons)
- Adding route tracking to the main map
- Changing the polling interval or data fetching strategy

## Decisions

### 1. Reuse existing `flyTo` pattern for main map focus
**Decision**: Use the existing `map.flyTo(coordinates)` call that already exists in `pumpuang-location-markers.tsx` when a marker is clicked. Ensure it fires reliably when the drawer opens.
**Rationale**: The pattern is already established and working for marker clicks. No new abstraction needed.

### 2. Add car icon as a Leaflet marker on the embedded route map
**Decision**: Create a new Leaflet `L.icon` using a car PNG asset, and render it as a marker on the `pumpuang-route-history.tsx` embedded map at the vehicle's current coordinates.
**Rationale**: Consistent with how the main map renders pumpuang markers using custom icons. The `leaflet-rotatedmarker` plugin is already available for directional rotation.

### 3. Car icon asset
**Decision**: Add a car icon PNG to `public/assets/icons/pumpuang/` alongside existing marker icons. Use a single car icon (no left/right variants) with rotation via `leaflet-rotatedmarker`.
**Rationale**: A single rotatable icon is simpler than maintaining left/right variants. The rotation plugin is already a project dependency.

## Risks / Trade-offs

- **[Embedded map re-render on location update]** → Use marker ref to update position via `setLatLng()` instead of re-rendering the component, matching the pattern in `pumpuang-location-markers.tsx`.
- **[Car icon visibility over route polyline]** → Set a high `zIndexOffset` on the car marker to ensure it renders above the route line.
