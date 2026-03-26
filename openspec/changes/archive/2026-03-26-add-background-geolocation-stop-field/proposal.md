## Why

The mobile app's background geolocation plugin continues sending location updates even when the pumpuang status becomes INACTIVE (e.g., after auto-close due to operating hours or admin force-stop). The backend needs a way to signal the app to stop its background geolocation service via the tracking response, so the app can react immediately without polling a separate endpoint.

## What Changes

- Add a `background_geolocation` field to `PumpuangLocationTrackingResponseDto` that returns `["stop"]` when the pumpuang status is INACTIVE
- When status is RUNNING and tracking is active, the field is omitted or returns an empty array
- The tracking endpoint (`POST app/tracking`) response will include this new field so the app can check it and stop sending location data

## Capabilities

### New Capabilities
- `background-geolocation-stop-signal`: Add a `background_geolocation` response field to the pumpuang tracking DTO that instructs the mobile app to stop its background geolocation service when the pumpuang is inactive

### Modified Capabilities
- `pumpuang-direction-tracking`: The tracking response DTO gains a new field that affects how the app handles background geolocation behavior

## Impact

- **Contracts**: `PumpuangLocationTrackingResponseDto` in `packages/contracts` gains a new optional field
- **Backend**: Pumpuang tracking service/controller must populate the new field based on pumpuang status
- **Mobile App**: Must read `background_geolocation` from tracking response and stop the background geolocation plugin when it contains `"stop"`
- **API**: Non-breaking change — new optional field in existing response
