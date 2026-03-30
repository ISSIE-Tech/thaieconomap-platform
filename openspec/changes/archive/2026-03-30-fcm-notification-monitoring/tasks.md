## 1. Contracts & Shared Types

- [x] 1.1 Add `DEVELOPER` value to `UserRole` enum in `packages/contracts/src/enums/user-role.enum.ts`
- [x] 1.2 Create `IFcmNotificationLog` interface in `packages/contracts/src/models/` with fields: sendTo, status, reason, errorMessage, timestamp
- [x] 1.3 Export new interfaces and enum values from contracts package barrel files

## 2. Backend - Notification Log Schema & Repository

- [x] 2.1 Create `FcmNotificationLog` Mongoose schema in `apps/backend/src/modules/notifications/schemas/` with fields: sendTo, status, reason, errorMessage, createdAt (with 90-day TTL index)
- [x] 2.2 Create `FcmNotificationLogRepository` in `apps/backend/src/modules/notifications/repositories/` with methods: create, findPaginated (with filters for status, sendTo, date range), countByPumpuangIds
- [x] 2.3 Register schema in the notifications module

## 3. Backend - Notification Logging Service

- [x] 3.1 Create `FcmNotificationLogService` in `apps/backend/src/modules/notifications/services/` that wraps the repository and provides log creation
- [x] 3.2 Modify `FcmService.sendToDevice` to log send results (success/failure) via `FcmNotificationLogService`
- [x] 3.3 Modify `FcmService.sendToMultiple` to log per-device results via `FcmNotificationLogService`
- [x] 3.4 Modify `FcmService.sendToTopic` to log send results via `FcmNotificationLogService`

## 4. Backend - New API Endpoints

- [x] 4.1 Create DTOs: `GetNotificationLogsDto` (query params: status, sendTo, from, to, page, limit), `TestSendDto` (pumpuangId), `GetTokenCountsDto` (ids array)
- [x] 4.2 Add `GET /notifications/logs` endpoint — returns paginated logs with filters, restricted to ADMIN/DEVELOPER roles
- [x] 4.3 Add `GET /notifications/token-counts` endpoint — accepts comma-separated pumpuang IDs, returns token count map
- [x] 4.4 Add `POST /notifications/test-send` endpoint — sends test notification to all tokens for a pumpuangId, restricted to ADMIN/DEVELOPER roles, logs with reason "manual test"

## 5. Gateway - Role Updates

- [x] 5.1 Update gateway auth service role mapping to recognize `DEVELOPER` role
- [x] 5.2 Add proxy routes for the new notification endpoints (`/notifications/logs`, `/notifications/token-counts`, `/notifications/test-send`)

## 6. Admin Frontend - FCM Logs Page

- [x] 6.1 Create FCM logs API hooks in `apps/admin/src/modules/` (useGetFcmLogs with pagination/filters)
- [x] 6.2 Create FCM Logs list page at `apps/admin/src/pages/dashboard/fcm-logs/` with table displaying: sendTo, status (with chip indicator), reason, errorMessage, timestamp
- [x] 6.3 Add status filter dropdown, date range picker, and sendTo search field to the FCM Logs page
- [x] 6.4 Add "FCM Logs" navigation entry in `apps/admin/src/layouts/config-nav-dashboard.tsx`, visible only to ADMIN and DEVELOPER roles
- [x] 6.5 Wrap FCM Logs page with `RoleBasedGuard` for ADMIN/DEVELOPER access

## 7. Admin Frontend - Pumpuang List Enhancement

- [x] 7.1 Create API hook `useGetTokenCounts` that calls `GET /notifications/token-counts` with visible pumpuang IDs
- [x] 7.2 Create API hook `useTestSendNotification` that calls `POST /notifications/test-send`
- [x] 7.3 Add "FCM Tokens" column to pumpuang list table showing token count per row
- [x] 7.4 Add "Test Send" button to each pumpuang row with confirmation dialog, success/error snackbar feedback
