## Context

The pumpuang mobile app uses a background geolocation plugin to continuously send location updates to `POST app/tracking`. Currently, when a pumpuang becomes INACTIVE (via auto-close, admin force-stop, or daily force-close), the backend has no way to signal the app to stop its background geolocation service through the tracking response. The app continues sending updates until it independently detects the status change.

The `PumpuangLocationTrackingResponseDto` currently returns `{ location, status }`. The `status` field already contains RUNNING/INACTIVE, but the app's background geolocation plugin needs a specific command format (`background_geolocation: ["stop"]`) to trigger its stop behavior.

## Goals / Non-Goals

**Goals:**
- Add `background_geolocation` field to `PumpuangLocationTrackingResponseDto` that returns `["stop"]` when pumpuang status is INACTIVE
- Keep the change backward-compatible (new optional field)

**Non-Goals:**
- Changing the app's background geolocation plugin configuration
- Modifying other tracking endpoints (start/stop) — only the main tracking endpoint needs this
- Adding other background geolocation commands beyond "stop"

## Decisions

### 1. Field type: `string[]` (array of commands)
The `background_geolocation` field will be typed as `string[]`. When the pumpuang is INACTIVE, it returns `["stop"]`. This matches the convention expected by the mobile background geolocation plugin.

**Alternative considered**: A boolean `shouldStop` field — rejected because the array format aligns with the plugin's expected command structure shown in the screenshot.

### 2. Field population location: Service layer
The `background_geolocation` field will be populated in the pumpuang service's tracking method based on the pumpuang's current status. If status is INACTIVE, return `["stop"]`; otherwise omit or return an empty array.

### 3. Only on `POST app/tracking` response
The field is only relevant on the main tracking endpoint response, not on start/stop endpoints, since it's meant to reactively inform an already-running background geolocation session.

## Risks / Trade-offs

- **[Low risk] Mobile app must handle new field** → The field is optional/additive, so older app versions that don't read it will simply ignore it. No breaking change.
- **[Low risk] Race condition on status change** → If the status changes between the check and response, the next tracking request will pick up the correct value.
