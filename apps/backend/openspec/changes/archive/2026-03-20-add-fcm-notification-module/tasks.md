## 1. Configuration & Dependencies

- [x] 1.1 Install `firebase-admin` npm package
- [x] 1.2 Add `FCM_PROJECT_ID`, `FCM_CLIENT_EMAIL`, `FCM_PRIVATE_KEY` to Joi validation in `src/config/environment.ts` (optional, not required — graceful degradation)
- [x] 1.3 Add FCM constants to `src/shared/constants/global-config.ts`
- [x] 1.4 Add FCM variables to `.env` with placeholder values

## 2. Module Scaffolding

- [x] 2.1 Create `src/modules/notifications/` directory structure (module, controller, services, dto, schemas, repositories)
- [x] 2.2 Create `NotificationsModule` with `ConfigModule` import, export `FcmService` and `DeviceTokenRepository` for use by other modules
- [x] 2.3 Register `NotificationsModule` in `src/app.module.ts`
- [x] 2.4 Export module from `src/modules/index.ts`

## 3. Device Token Schema & Repository

- [x] 3.1 Create `DeviceToken` Mongoose schema with fields: `pumpuangId` (indexed), `token` (unique), `platform` (enum: ios/android), timestamps
- [x] 3.2 Create `DeviceTokenRepository` with methods: `upsertToken`, `removeToken`, `findTokensByPumpuangId`, `removeTokensByValues`
- [x] 3.3 Register schema in `NotificationsModule`

## 4. FCM Service (Core)

- [x] 4.1 Create `FcmService` that initializes Firebase Admin SDK on module init using env credentials
- [x] 4.2 Implement graceful degradation — log warning and skip sends when credentials are missing
- [x] 4.3 Implement `sendToDevice(token, title, body, data?)` — single device send with fire-and-forget error handling
- [x] 4.4 Implement `sendToMultiple(tokens[], title, body, data?)` — multicast send using `sendEachForMulticast()`
- [x] 4.5 Implement `sendToTopic(topic, title, body, data?)` — topic-based send
- [x] 4.6 Implement invalid token cleanup — on `messaging/registration-token-not-registered` errors, remove tokens via repository

## 5. Notification Service

- [x] 5.1 Create `NotificationService` that combines `FcmService` and `DeviceTokenRepository`
- [x] 5.2 Implement `sendToPumpuang(pumpuangId, title, body, data?)` — look up pumpuang tokens and send multicast
- [x] 5.3 Implement `sendToTopic(topic, title, body, data?)` — delegate to FcmService

## 6. DTOs & Validation

- [x] 6.1 Create `UpdateFcmTokenDto` with `token` (required) and `platform` (optional, enum: ios/android) — used by pumpuang app endpoints
- [x] 6.2 Create `RemoveFcmTokenDto` with `token` (required) — used by pumpuang app delete endpoint
- [x] 6.3 Create `SendNotificationDto` with `pumpuangId`, `title`, `body`, `data` (optional) — used by admin send endpoint
- [x] 6.4 Create `SendTopicNotificationDto` with `topic`, `title`, `body`, `data` (optional)
- [x] 6.5 Add `@ApiProperty` Swagger decorators to all DTOs

## 7. Pumpuang App FCM Token Endpoints

- [x] 7.1 Import `NotificationsModule` in `PumpuangsModule`
- [x] 7.2 Add `PUT /pumpuangs/app/fcm-token` in `PumpuangsController` — register/update FCM token, protected by `PumpuangJwtAccessGuard`, extract `pumpuangId` from JWT
- [x] 7.3 Add `DELETE /pumpuangs/app/fcm-token` in `PumpuangsController` — remove FCM token on logout, protected by `PumpuangJwtAccessGuard`
- [x] 7.4 Add Swagger `@ApiOperation` decorators for the new endpoints

## 8. Notifications Controller (Admin/Internal Endpoints)

- [x] 8.1 Create `NotificationsController` with route prefix `/notifications`
- [x] 8.2 Implement `POST /notifications/send` — send notification to a pumpuang by `pumpuangId`
- [x] 8.3 Implement `POST /notifications/send-topic` — send notification to an FCM topic
- [x] 8.4 Add Swagger `@ApiTags` and `@ApiOperation` decorators

## 9. Error Codes

- [x] 9.1 Add notification-related error codes to `src/shared/constants/codes.ts` (e.g., `TEC_NOTIFICATION_SEND_FAILED`, `TEC_FCM_NOT_CONFIGURED`)

## 10. Integration & Testing

- [ ] 10.1 Verify module starts correctly with FCM credentials set
- [ ] 10.2 Verify module starts correctly without FCM credentials (graceful degradation)
- [ ] 10.3 Test `PUT /pumpuangs/app/fcm-token` — registration, duplicate handling, cross-pumpuang reassignment
- [ ] 10.4 Test `DELETE /pumpuangs/app/fcm-token` — removal and idempotency
- [ ] 10.5 Test admin send endpoints return correct responses
- [ ] 10.6 Verify Swagger docs show all new endpoints
