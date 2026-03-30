## 1. Redis Cache Key Constants

- [x] 1.1 Add notification Redis cache key templates to `shared/constants` (open, close, close-followup patterns with pumpuangId and date placeholders)

## 2. Open-Time Notification Cron

- [x] 2.1 Add `sendOpenTimeNotifications()` cron method to `PumpuangsService` that runs every minute
- [x] 2.2 Query all accepted pumpuangs (any status) where today's opening is enabled
- [x] 2.3 For each pumpuang, check if current minute (Bangkok TZ) matches their first `open` time for today
- [x] 2.4 Check Redis dedup key before sending; skip if already sent today
- [x] 2.5 Send FCM notification via `notificationService.sendToPumpuang()` with reason `open-time-reminder`
- [x] 2.6 Set Redis dedup key with 24h TTL after successful send
- [x] 2.7 Wrap Redis/FCM calls in try-catch to handle failures gracefully

## 3. Close-Time Notification Cron

- [x] 3.1 Add `sendCloseTimeNotifications()` cron method to `PumpuangsService` that runs every minute
- [x] 3.2 Query only RUNNING pumpuangs where today's opening is enabled
- [x] 3.3 For each pumpuang, check if current minute matches their last `close` time for today
- [x] 3.4 Check Redis dedup key before sending; skip if already sent today
- [x] 3.5 Send FCM notification with reason `close-time-reminder`
- [x] 3.6 Set Redis dedup key with 24h TTL after successful send

## 4. Close-Time Follow-Up Notification (1 Hour After Close)

- [x] 4.1 In the same or separate cron method, check if current minute equals last `close` time + 60 for RUNNING pumpuangs
- [x] 4.2 Check Redis dedup key for follow-up; skip if already sent today
- [x] 4.3 Send FCM notification with reason `close-time-reminder-followup`
- [x] 4.4 Set Redis dedup key with 24h TTL after successful send

## 5. Thai Notification Messages

- [x] 5.1 Define Thai notification title and body strings for open-time reminder (e.g., "ถึงเวลาเปิดร้านแล้ว" / "กรุณาเริ่มส่งตำแหน่งรถปั่นเปี๊ยง")
- [x] 5.2 Define Thai notification title and body strings for close-time reminder (e.g., "ถึงเวลาปิดร้านแล้ว" / "กรุณาปิดการส่งตำแหน่งรถปั่นเปี๊ยง")
- [x] 5.3 Define Thai notification title and body strings for close-time follow-up (e.g., "เตือนอีกครั้ง" / "รถปั่นเปี๊ยงยังเปิดอยู่ กรุณาปิดการส่งตำแหน่ง")

## 6. Testing & Verification

- [x] 6.1 Manually verify open-time notification fires at the correct minute for a test pumpuang
- [x] 6.2 Verify close-time notification fires at the correct minute for a running pumpuang
- [x] 6.3 Verify follow-up notification fires 1 hour after close for a still-running pumpuang
- [x] 6.4 Verify no duplicate notifications are sent on subsequent cron ticks
- [x] 6.5 Verify FCM notification logs contain the correct reason values
