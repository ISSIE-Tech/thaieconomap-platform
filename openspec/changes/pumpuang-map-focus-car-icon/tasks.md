## 1. Assets

- [x] 1.1 Add car icon PNG to `public/assets/icons/pumpuang/` (e.g., `car-icon.png`) — `Handoff_Car.png` already existed, created `pumpuangCarMarker` icon in `map.tsx`

## 2. Main Map Focus on Drawer Open

- [x] 2.1 Ensure `map.flyTo()` fires reliably in `pumpuang-location-markers.tsx` when a pumpuang marker is clicked and the drawer opens — already working
- [x] 2.2 Verify the map centers on the selected pumpuang even if the marker is already visible on screen — already working

## 3. Car Icon on Embedded Route Map

- [x] 3.1 Create a Leaflet `L.icon` for the car icon in `pumpuang-route-history.tsx` — added `pumpuangCarMarker` in shared `map.tsx`, imported in route history
- [x] 3.2 Render a marker at the vehicle's current coordinates on the embedded route history map — updated to use `pumpuangCarMarker`
- [x] 3.3 Set high `zIndexOffset` on the car marker so it renders above the route polyline — added `zIndexOffset: 1000`
- [x] 3.4 Apply rotation via `leaflet-rotatedmarker` based on the vehicle's direction/bearing — already working with `setRotationAngle()`

## 4. Real-Time Updates

- [x] 4.1 Use a marker ref to update car icon position via `setLatLng()` when new location data arrives (every 1s poll) — already working
- [x] 4.2 Update rotation angle via `setRotationAngle()` when direction changes — already working

## 5. Verification

- [ ] 5.1 Test: clicking a marker opens drawer and map flies to that location
- [ ] 5.2 Test: car icon appears on embedded map at correct position with correct rotation
- [ ] 5.3 Test: car icon updates position and rotation in real-time as polling delivers new data
