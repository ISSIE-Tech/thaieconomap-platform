## 1. Backend - Schema Changes

- [x] 1.1 Add `pumpuangName` optional field to `OtpLog` schema
- [x] 1.2 Add `pumpuangName` optional field to `FcmNotificationLog` schema
- [x] 1.3 Update `CreateOtpLogDto` interface in OtpLogRepository to include `pumpuangName`
- [x] 1.4 Update `CreateLogDto` interface in FcmNotificationLogRepository to include `pumpuangName`

## 2. Backend - Service Changes

- [x] 2.1 Update `OtpLogService` methods to accept and pass `pumpuangName`
- [x] 2.2 Update `PumpuangsService` OTP methods to pass pumpuang owner name when logging
- [x] 2.3 Update `FcmService` to accept optional `pumpuangName` parameter and pass to log creation
- [x] 2.4 Update `NotificationService.sendToPumpuang` to accept optional pumpuangName and pass to FcmService

## 3. Admin Frontend

- [x] 3.1 Update OTP Logs table: replace "Pumpuang ID" column with "Pumpuang Name"
- [x] 3.2 Update FCM Logs table: add "Pumpuang Name" column
- [x] 3.3 Update frontend types for both log entries to include `pumpuangName`
