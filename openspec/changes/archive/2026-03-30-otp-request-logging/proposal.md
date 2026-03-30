## Why

OTP requests and verifications via ThaiBulkSMS have no persistent logging. When issues arise (failed deliveries, verification errors), there's no way to trace what happened. Adding OTP logs — similar to the existing FCM notification logs — gives developers visibility into OTP operations through the admin dashboard.

## What Changes

- **New MongoDB collection** `otp_logs` to persist every OTP request and verification attempt, storing: phone number, pumpuang ID, action (request/verify), status (success/failure), reference number, error message, and timestamp.
- **New backend service layer** to log OTP operations automatically when `PumpuangService` processes OTP requests and verifications.
- **New backend API endpoint** `POST /otp/logs` to query paginated OTP logs with filters.
- **New admin page**: OTP Logs tab under the developer section in the admin dashboard, with a filterable/searchable table of all OTP log entries.

## Capabilities

### New Capabilities
- `otp-request-logging`: Persist every OTP request and verification attempt to MongoDB and expose via admin dashboard

### Modified Capabilities
<!-- No existing spec-level requirements are changing -->

## Impact

- **Backend**: New schema, repository, and service for OTP logs. Modified `PumpuangService` OTP methods to log results. New controller endpoint for querying logs.
- **Admin frontend**: New OTP Logs page under the developer navigation section, following the same pattern as FCM Logs.
- **Database**: New `otp_logs` collection in MongoDB with TTL index.
