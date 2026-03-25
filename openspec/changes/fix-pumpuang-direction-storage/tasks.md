## 1. Backend: Fix direction storage in Redis

- [x] 1.1 In `pumpuang.service.ts:updateLocationCache`, replace the `...locationDto` spread with explicit construction: `{ location: formattedLocation, direction: locationDto.location.coords.heading ?? 0, speed: locationDto.location.coords.speed ?? 0 }`
- [x] 1.2 Update `ICurrentPumpuangLocation` in `pumpuang.interfaces.ts` to add optional `speed: number` field
- [x] 1.3 Update `PumpuangTinyResponseDto` and `PumpuangRouteResponseDto` in contracts to add optional `speed` field

## 2. Frontend: Remove debug code

- [x] 2.1 Remove the `debugArrowRef` and debug arrow polyline drawing code from `pumpuang-route-history.tsx`
- [x] 2.2 Remove unused `useRef` import if no longer needed

## 3. Verification

- [x] 3.1 Verify backend compiles with no type errors
- [x] 3.2 Verify frontend compiles with no type errors
