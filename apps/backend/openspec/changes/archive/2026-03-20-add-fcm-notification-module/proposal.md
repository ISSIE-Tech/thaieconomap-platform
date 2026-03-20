## Why

The Pumpuang mobile app currently has no way to receive real-time push notifications from the backend. Adding FCM (Firebase Cloud Messaging) support enables the system to send push notifications to riders and users — such as order updates, location alerts, and announcements — improving engagement and operational responsiveness.

## What Changes

- Add a new `notifications` module (`src/modules/notifications/`) with a service for sending push notifications via FCM
- Add FCM-related environment variables (`FCM_PROJECT_ID`, `FCM_PRIVATE_KEY`, `FCM_CLIENT_EMAIL`, etc.) with Joi validation in `environment.ts` and constants in `global-config.ts`
- Add admin/internal API endpoints for sending notifications (`/notifications/send`, `/notifications/send-topic`)
- Add pumpuang app-facing endpoints for FCM token management (`PUT /pumpuangs/app/fcm-token`, `DELETE /pumpuangs/app/fcm-token`) protected by `PumpuangJwtAccessGuard`
- Add device token storage per pumpuang in a dedicated MongoDB collection
- Add new error codes for notification failures in `codes.ts`
- Integrate with the existing `pumpuangs` module for targeted notifications

## Capabilities

### New Capabilities
- `fcm-push-notification`: Core FCM integration — initializing Firebase Admin SDK, sending push notifications to single devices and topics, handling delivery errors and token invalidation
- `device-token-management`: Registering, updating, and removing FCM device tokens per pumpuang via `/pumpuangs/app/fcm-token`, stored in MongoDB

### Modified Capabilities
_(none — this is a new standalone module with no changes to existing spec-level behavior)_

## Impact

- **Dependencies**: New npm package `firebase-admin` added to `package.json`
- **Configuration**: 3-4 new environment variables required (FCM service account credentials); `.env` and `environment.ts` updated
- **Database**: New MongoDB collection for device tokens linked by `pumpuangId`
- **API surface**: FCM token management at `/pumpuangs/app/fcm-token` (mobile app); send endpoints at `/notifications/send` and `/notifications/send-topic` (internal/admin)
- **Modules**: New `NotificationsModule` registered in `app.module.ts`; imported by `PumpuangsModule` for FCM token routes and triggered notifications
