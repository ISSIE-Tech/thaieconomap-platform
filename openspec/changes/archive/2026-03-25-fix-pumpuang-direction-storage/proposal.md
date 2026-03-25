## Why

The pumpuang car icon on the route history map displays with an incorrect direction because the backend never stores the `direction` field in Redis. In `pumpuang.service.ts:updateLocationCache`, the code spreads `locationDto` (which only has a `location` property of type `LocationPayloadDto`) and overrides `location` with a formatted string. The device's `coords.heading` value is lost — it's never extracted and mapped to `current.direction`. As a result, the API returns `undefined` for `direction`, and the frontend marker rotation is broken.

## What Changes

- **Backend fix**: In `updateLocationCache`, extract `locationDto.location.coords.heading` and store it as `direction` in the `currentLocation` object written to Redis.
- **Backend fix**: Also store `coords.speed` as `speed` in `current` so the frontend can optionally use it for display or animation purposes.
- **Frontend cleanup**: Remove the debug arrow polyline from `pumpuang-route-history.tsx` that was added during investigation.

## Capabilities

### New Capabilities
- `pumpuang-direction-tracking`: Correctly store and serve vehicle direction (heading) and speed from device GPS data through Redis to the frontend API response.

### Modified Capabilities
- None

## Impact

- **Backend**: `apps/backend/src/modules/pumpuangs/services/pumpuang.service.ts` — `updateLocationCache` method
- **Contracts**: `packages/contracts/src/dto/response/pumpuangs/pumpuang-response.dto.ts` — may need `speed` added to response type
- **Backend interfaces**: `apps/backend/src/shared/interfaces/pumpuang.interfaces.ts` — `ICurrentPumpuangLocation` may need `speed` field
- **Frontend**: `pumpuang-route-history.tsx` — remove debug code
- **Redis data**: Existing cached pumpuang locations will get `direction` on next tracking update (no migration needed since Redis data is ephemeral)
