## 1. Backend Cron Job

- [x] 1.1 Add `forceCloseAllTrackingDaily` cron method in `PumpuangsService` scheduled at 23:50 Asia/Bangkok timezone
- [x] 1.2 Query all RUNNING pumpuangs, call `stopPumpuangRiderTracking` for each, send FCM notification
