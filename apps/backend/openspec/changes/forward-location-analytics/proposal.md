## Why

Pumpuang location data is currently stored only in Redis/MongoDB for real-time tracking. We need to forward this data to an external analytics service to enable route analysis, fleet insights, and operational monitoring — decoupled from the core tracking system.

## What Changes

- Add an HTTP POST call to an external analytics webhook (`/api/webhook/location`) after each location update in `pumpuangRiderTracking()`
- The call is fire-and-forget: failures are logged but do not block the tracking response
- Add two new environment variables: `ANALYTICS_WEBHOOK_URL` and `ANALYTICS_WEBHOOK_API_KEY`
- Create a dedicated service to handle the outbound HTTP call with proper error handling
- Register `HttpModule` in the Pumpuangs module for making outbound requests

## Capabilities

### New Capabilities
- `location-analytics-forwarding`: Forward pumpuang location data to an external analytics service via HTTP webhook on each tracking update

### Modified Capabilities
<!-- No existing spec-level requirements are changing -->

## Impact

- **Code**: `PumpuangsService.pumpuangRiderTracking()`, `PumpuangsModule`
- **New service**: Analytics forwarding service (handles HTTP POST + error handling)
- **Config**: New env vars `ANALYTICS_WEBHOOK_URL`, `ANALYTICS_WEBHOOK_API_KEY`
- **Dependencies**: NestJS `HttpModule` / `HttpService` (from `@nestjs/axios`)
- **Risk**: Low — fire-and-forget pattern means analytics failures cannot impact core tracking
