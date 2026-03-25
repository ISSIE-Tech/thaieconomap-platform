## Context

The mobile app sends GPS tracking data to `POST /pumpuangs/app/tracking` with the structure:
```
{ location: { coords: { latitude, longitude, heading, speed, ... }, ... } }
```

In `updateLocationCache` (pumpuang.service.ts:769-772), the code does:
```typescript
const currentLocation = {
  ...locationDto,          // { location: LocationPayloadDto }
  location: formattedLocation,  // overrides to "lng,lat" string
};
```

Since `PumpuangLocationDto` only has a `location` property, spreading it and overriding `location` results in `currentLocation = { location: "lng,lat" }` — the `heading` and `speed` from `coords` are lost.

The `ICurrentPumpuangLocation` interface expects `{ location: string; direction: number }`, but `direction` is never set.

## Goals / Non-Goals

**Goals:**
- Store `coords.heading` as `current.direction` in Redis
- Store `coords.speed` as `current.speed` in Redis for future use
- Ensure the frontend receives correct direction values via `/pumpuangs/tiny` and `/pumpuangs/:id/route`

**Non-Goals:**
- Changing the GPS polling interval or tracking behavior
- Adding direction to the history entries (they remain location-only)
- Modifying the frontend marker rotation logic (already correct, just needs real data)

## Decisions

### 1. Explicitly construct `currentLocation` instead of spreading `locationDto`
**Decision**: Replace the spread pattern with explicit field extraction.
**Rationale**: The spread pattern is misleading — it looks like it preserves fields from `locationDto`, but since `locationDto` only has `location` (which gets overridden), nothing is preserved. Explicit construction is clearer and correct.

### 2. Default `direction` to 0 when `heading` is undefined
**Decision**: Use `?? 0` fallback for heading.
**Rationale**: `heading` is optional in `CoordsDto`. A default of 0 (north) is reasonable and prevents `undefined` from reaching the frontend. The existing frontend code already handles 0 correctly.

### 3. Add `speed` to the stored data
**Decision**: Store `coords.speed` alongside direction.
**Rationale**: Speed is already available from the device and useful for future features (e.g., showing whether the vehicle is moving). Low cost to store.

## Risks / Trade-offs

- **[Existing Redis data has no direction]** → No migration needed. Redis pumpuang location data is ephemeral (cleared on tracking stop). New tracking sessions will store direction correctly.
- **[Type mismatch in IPumpuangLocationCache]** → The interface currently types `current` as `PumpuangLocationDto`, but the actual stored shape is `{ location: string, direction: number }`. This is a pre-existing type inconsistency. The fix doesn't worsen it.
