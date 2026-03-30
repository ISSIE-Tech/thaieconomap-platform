## Context

OTP is used for pumpuang driver authentication via ThaiBulkSMS. The flow is: `POST /pumpuangs/app/auth/otp/request` (sends SMS) → `POST /pumpuangs/app/auth/otp/verify` (validates PIN). Currently no logging persists beyond NestJS console output. The FCM notification logging system (`FcmNotificationLog` schema, repository, service, admin page) provides an established pattern to follow.

## Goals / Non-Goals

**Goals:**
- Persist every OTP request and verify attempt with phone number, pumpuang ID, action type, status, reference number, error, and timestamp
- Provide an admin page for developers to view and filter OTP logs
- Follow the same architectural pattern as FCM notification logging

**Non-Goals:**
- Modifying the OTP request/verify flow itself
- Rate limiting or abuse detection based on logs
- Real-time monitoring (polling/manual refresh is sufficient)

## Decisions

### 1. Separate collection vs. shared notification logs

**Decision**: Create a dedicated `otp_logs` collection with its own schema.

**Rationale**: OTP logs have different fields (phone number, pumpuang ID, action, refno) than FCM logs (sendTo, reason). A shared collection would require union types and complicate querying. Separate collections follow the existing pattern where `fcm_notification_logs` and `device_tokens` are distinct.

### 2. Logging approach: Inline in PumpuangService vs. dedicated service

**Decision**: Create an `OtpLogService` and inject it into `PumpuangService`. Log after each OTP request/verify call.

**Rationale**: Follows the same pattern as `FcmNotificationLogService`. Keeps logging concern separate from business logic.

### 3. Admin page: New page vs. tab on FCM logs

**Decision**: New standalone OTP Logs page under the developer navigation section, alongside FCM Logs.

**Rationale**: OTP logs are a distinct concern from FCM logs. Separate pages keep the UI clean and allow independent filtering.

## Risks / Trade-offs

- **Phone number in logs** → Store full phone number for debugging. The admin page is already restricted to DEVELOPER role.
- **Log volume** → Add 90-day TTL index (same as FCM logs) to auto-expire old entries.
