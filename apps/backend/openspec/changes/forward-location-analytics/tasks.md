## 1. Configuration

- [x] 1.1 Add `ANALYTICS_WEBHOOK_URL` and `ANALYTICS_WEBHOOK_API_KEY` to `.env` (empty/commented out by default)
- [x] 1.2 Register `ConfigModule` in `PumpuangsModule` if not already available, ensure env vars are accessible via `ConfigService`

## 2. Analytics Service

- [x] 2.1 Create `LocationAnalyticsService` in `src/modules/pumpuangs/services/` with `HttpService` and `ConfigService` injected
- [x] 2.2 Implement `forwardLocation(pumpuangId: string, locationDto: PumpuangLocationDto)` method that builds the payload (`service`, `trackerId`, `location`) and sends HTTP POST with `X-Api-Key` header and 5s timeout
- [x] 2.3 Add error handling: catch all errors, log warnings via NestJS `Logger`, never throw
- [x] 2.4 Add startup check: log info message if analytics env vars are missing (forwarding disabled)

## 3. Module Wiring

- [x] 3.1 Import `HttpModule` (from `@nestjs/axios`) in `PumpuangsModule` with default 5s timeout
- [x] 3.2 Register `LocationAnalyticsService` as a provider in `PumpuangsModule`
- [x] 3.3 Inject `LocationAnalyticsService` into `PumpuangsService`

## 4. Integration

- [x] 4.1 Call `locationAnalyticsService.forwardLocation()` in `pumpuangRiderTracking()` after the Redis `json.set` call — fire-and-forget (no `await`)
- [x] 4.2 Ensure forwarding only happens when the location is actually stored (status is RUNNING, within opening hours, valid history index)

## 5. Verification

- [x] 5.1 Test with both env vars set: confirm HTTP POST is sent with correct payload and headers
- [x] 5.2 Test with env vars missing: confirm no HTTP calls are made and info log appears on startup
- [x] 5.3 Test with analytics service down: confirm tracking endpoint still returns normal response
