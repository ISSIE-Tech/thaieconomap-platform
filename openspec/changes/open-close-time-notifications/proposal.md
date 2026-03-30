## Why

Pumpuang riders currently have no reminder to start sending their location when their operating hours begin, and the only close-time mechanism is an automatic tracking stop. Proactive notifications at open and close times will improve rider engagement and give them a chance to start/stop tracking voluntarily instead of relying solely on auto-close.

## What Changes

- Add a cron job that runs every minute to check each pumpuang's operating hours against the current time (Bangkok timezone).
- At **open time**: send an FCM notification reminding the rider to start sending their location.
- At **close time**: send an FCM notification asking the rider to stop tracking.
  - If tracking is still active **1 hour after close time**, send a second reminder notification.
  - No further notifications are sent after the second reminder (existing auto-close handles the rest).
- Track which open/close notifications have already been sent today per pumpuang to avoid duplicates (e.g., using a Redis key with TTL or an in-memory/DB flag that resets daily).

## Capabilities

### New Capabilities
- `open-close-time-notifications`: Scheduled notification system that sends FCM push notifications to pumpuang riders at their configured open time and close time, with a single follow-up reminder 1 hour after close if still tracking.

### Modified Capabilities
- `fcm-notification-logging`: New notification reasons ("open-time-reminder", "close-time-reminder", "close-time-reminder-followup") will be logged through the existing FCM logging system.

## Impact

- **Backend**: New cron job in `pumpuang.service.ts` or a dedicated service; uses existing `NotificationService.sendToPumpuang()` and `FcmNotificationLogRepository`.
- **Redis**: Needs keys to track daily notification state per pumpuang (sent/not-sent) to prevent duplicate sends on each cron tick.
- **Database**: No schema changes; uses existing `Opening` / `OpeningTime` schemas and `FcmNotificationLog`.
- **External**: Additional FCM messages sent daily per active pumpuang (2-3 per day max).
