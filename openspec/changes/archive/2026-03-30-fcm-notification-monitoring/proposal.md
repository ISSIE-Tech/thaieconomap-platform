## Why

FCM notifications are sent to pumpuang drivers but there is no visibility into whether they succeed or fail. Admins have no way to monitor notification delivery, debug failures, or manually test notifications. Adding an FCM monitoring dashboard and notification logging enables operational visibility and debugging capability for the admin team.

## What Changes

- **New MongoDB collection** `fcm_notification_logs` to persist every FCM notification sent, storing: recipient (send to), status (success/failure), reason (why it was sent), error message (if failed), and timestamp.
- **New backend service layer** to log each notification send result (success or error) into the database automatically when `FcmService` sends notifications.
- **New gateway role**: Add `DEVELOPER` role to the `UserRole` enum, allowing admin users with this role to access FCM monitoring features.
- **New admin page**: FCM Notification Logs tab under the admin dashboard, accessible only to users with `ADMIN` or `DEVELOPER` roles. Displays a filterable/searchable table of all notification logs.
- **Pumpuang list table enhancement**: Add a column showing FCM token count per pumpuang row, and a "Test Send" button to manually trigger a test notification to that pumpuang's registered devices.
- **New backend API endpoints**:
  - `GET /notifications/logs` — paginated list of notification logs with filters
  - `GET /notifications/token-count/:pumpuangId` — get FCM token count for a pumpuang
  - `POST /notifications/test-send` — manually send a test notification to a pumpuang

## Capabilities

### New Capabilities
- `fcm-notification-logging`: Persist every FCM notification send result (recipient, status, reason, error, timestamp) to MongoDB
- `fcm-admin-monitoring`: Admin dashboard page to view and filter FCM notification logs, restricted by role
- `pumpuang-fcm-overview`: Show FCM token count per pumpuang in the list table with manual test-send button

### Modified Capabilities
<!-- No existing spec-level requirements are changing -->

## Impact

- **Backend**: New schema, repository, and service for notification logs. Modified `FcmService` to log results. New controller endpoints for logs, token counts, and test sends.
- **Gateway**: New `DEVELOPER` role added to `UserRole` enum. Gateway role mapping updated.
- **Contracts**: `UserRole` enum updated with `DEVELOPER` value.
- **Admin frontend**: New FCM logs page, navigation config updated, pumpuang list table enhanced with token count column and test-send button.
- **Database**: New `fcm_notification_logs` collection in MongoDB.
