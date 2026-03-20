## Context

Pumpuang riders send location updates to `POST /pumpuangs/app/tracking`, handled by `PumpuangsService.pumpuangRiderTracking()`. This method validates status/opening hours, then stores location in Redis. We need to additionally forward each location update to an external analytics service without affecting the existing flow.

The project already has `@nestjs/axios` installed. The external analytics API expects a POST to `/api/webhook/location` with a JSON payload containing `service`, `trackerId`, and `location` fields, authenticated via `X-Api-Key` header.

## Goals / Non-Goals

**Goals:**
- Forward every successful location update to the analytics service
- Use environment variables for analytics URL and API key (no hardcoded values)
- Ensure analytics failures never block or degrade the core tracking response
- Keep the implementation simple and contained within the pumpuangs module

**Non-Goals:**
- Retry logic or queuing for failed analytics calls (out of scope for v1)
- Batching multiple location updates into a single analytics call
- Making the analytics payload configurable or transformable
- Adding analytics forwarding to start/stop tracking endpoints

## Decisions

### 1. Fire-and-forget pattern via async call without await

Forward the HTTP call asynchronously — call the method but don't `await` it in the main tracking flow. Catch and log errors internally.

**Why over alternatives:**
- **vs. queue (Bull/Redis)**: Overkill for a simple webhook — adds infra complexity for minimal benefit
- **vs. event emitter**: Would work, but adds indirection for a single consumer. Can migrate to events later if more consumers appear

### 2. Dedicated `LocationAnalyticsService` in the pumpuangs module

Create a small service responsible only for building the payload and making the HTTP POST.

**Why:** Keeps analytics logic out of the main `PumpuangsService`, making it easy to test and replace. Injected via DI so it can be mocked in tests.

### 3. Environment variables via `ConfigService` (`@nestjs/config`)

| Variable | Purpose | Required |
|---|---|---|
| `ANALYTICS_WEBHOOK_URL` | Base URL of the analytics service | No — forwarding disabled when absent |
| `ANALYTICS_WEBHOOK_API_KEY` | API key for `X-Api-Key` header | No — forwarding disabled when absent |

**Why:** Using `ConfigService` follows existing NestJS patterns. Making both optional means the feature is disabled by default in environments that don't set them — no breaking change.

### 4. Payload mapping

Map from the existing `PumpuangLocationDto` + pumpuang document to the analytics format:

```
{
  service: "pumm-puang",
  trackerId: pumpuang._id.toString(),
  location: locationDto.location   // pass through the full location object
}
```

**Why:** Uses the pumpuang `_id` as `trackerId` for unique identification. Passes the full location object as-is to preserve all fields (coords, activity, battery, etc.) for analytics.

## Risks / Trade-offs

- **[Silent failure]** → Analytics errors are only logged, not surfaced. Mitigation: use `Logger.warn` so failures appear in monitoring. Can add alerting later.
- **[Latency on analytics service]** → Slow analytics responses could accumulate in-flight requests. Mitigation: set a short HTTP timeout (5s). The call is not awaited in the main flow, so it doesn't affect response time.
- **[No env vars = silent no-op]** → If someone forgets to set env vars, no data flows. Mitigation: log an info message on service init if analytics is disabled.
