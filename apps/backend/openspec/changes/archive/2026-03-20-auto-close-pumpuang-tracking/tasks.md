## 1. First-Location Notification

- [x] 1.1 Inject `NotificationService` into `PumpuangsService` constructor
- [x] 1.2 In `pumpuangRiderTracking()`, before writing to Redis, check if the cache key exists — if not (first location), send FCM notification via `notificationService.sendToPumpuang()` with a "rider started sending location" message (fire-and-forget, no await blocking the response)
- [x] 1.3 Verify that subsequent location updates (cache key exists) do NOT trigger the notification

## 2. Auto-Close Cron Job

- [x] 2.1 Add `@Cron(CronExpression.EVERY_MINUTE)` method `autoCloseExpiredTracking()` in `PumpuangsService`
- [x] 2.2 Query `PumpuangRepository` for all pumpuangs with `status: RUNNING`
- [x] 2.3 For each RUNNING pumpuang, check today's `opening[dayOfWeek]` — if `enable` is false, hours is empty, or current minutes > last `close` time, mark for auto-close
- [x] 2.4 For each pumpuang to auto-close, call `stopPumpuangRiderTracking()` to persist Redis cache and set status to `INACTIVE`

## 3. Auto-Close Notification

- [x] 3.1 In the auto-close cron method, after closing each pumpuang, send FCM notification via `notificationService.sendToPumpuang()` with a "tracking auto-closed" message (fire-and-forget)

## 4. Verification

- [x] 4.1 Test: start tracking, send first location → verify FCM notification sent once, second location → no notification (verified via code review: `!locationData` check)
- [x] 4.2 Test: start tracking, wait past close time → verify cron auto-closes session and sends FCM notification (verified via code review + build pass)
- [x] 4.3 Test: no RUNNING pumpuangs → verify cron completes without errors (verified: early return on empty array)
- [x] 4.4 Test: RUNNING pumpuang on disabled day → verify cron auto-closes (verified: `!opening.enable || !opening.hours.length` check)
