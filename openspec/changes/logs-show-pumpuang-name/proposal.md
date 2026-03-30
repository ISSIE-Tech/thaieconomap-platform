## Why

The OTP Logs page shows raw pumpuang IDs and the FCM Logs page shows device tokens — neither is meaningful for developers debugging issues. Showing the pumpuang owner name makes logs immediately actionable without needing to cross-reference IDs manually.

## What Changes

- **OTP Log schema**: Add `pumpuangName` field, stored at log creation time (denormalized)
- **FCM Notification Log schema**: Add `pumpuangName` field, stored at log creation time
- **Backend services**: Pass pumpuang name when creating log entries
- **Admin OTP Logs page**: Replace Pumpuang ID column with Pumpuang Name column
- **Admin FCM Logs page**: Add Pumpuang Name column

## Capabilities

### New Capabilities

### Modified Capabilities
- `otp-request-logging`: Add pumpuangName field to OTP log entries and display in admin table
- `fcm-notification-logging`: Add pumpuangName field to FCM log entries and display in admin table

## Impact

- **Backend**: Schema changes (new optional field), service changes to pass name during logging
- **Admin frontend**: Table column updates in both FCM and OTP logs pages
- **Database**: New field in existing collections (backward compatible — field is optional)
