## Context

The backend already sends FCM notifications via `FcmService` (`sendToDevice`, `sendToMultiple`, `sendToTopic`) but does not persist any record of what was sent or whether it succeeded. The admin dashboard has no visibility into notification delivery. The existing role system supports `ADMIN`, `MANAGER`, and `CUSTOMER` roles defined in `packages/contracts/src/enums/user-role.enum.ts`. The pumpuang list page in the admin app shows pumpuang entries but has no FCM-related information.

The system uses MongoDB with Mongoose, NestJS on the backend/gateway, and Next.js + MUI on the admin frontend.

## Goals / Non-Goals

**Goals:**
- Persist every FCM notification send attempt with recipient, status, reason, error message, and timestamp
- Provide an admin page to view and filter notification logs
- Add a `DEVELOPER` role that grants access to FCM monitoring features
- Show FCM token count per pumpuang in the list table
- Allow admins to manually test-send a notification from the pumpuang list

**Non-Goals:**
- Real-time notification monitoring (WebSocket/SSE push) — polling or manual refresh is sufficient
- Analytics or aggregated dashboards (charts, success rates) — raw log viewing only
- Modifying the existing notification sending logic beyond adding logging
- FCM topic management or subscription management UI

## Decisions

### 1. Notification log storage: Embedded in existing FcmService vs. separate logging service

**Decision**: Create a dedicated `FcmNotificationLogService` and `FcmNotificationLog` Mongoose schema.

**Rationale**: Separating logging from sending keeps `FcmService` focused on delivery. The log service can be injected alongside `FcmService` and called after each send. This follows the existing pattern where services are separated by concern (e.g., `DeviceTokenRepository` is separate from `FcmService`).

**Alternative considered**: Wrapping `FcmService` methods to auto-log — rejected because it couples logging tightly and makes it harder to control what metadata is logged.

### 2. Role approach: New enum value vs. permission-based system

**Decision**: Add `DEVELOPER` to the existing `UserRole` enum in `packages/contracts/src/enums/user-role.enum.ts`.

**Rationale**: The existing role system is enum-based with a simple guard check. Adding a new enum value is the lowest-friction approach and consistent with how `ADMIN`, `MANAGER`, and `CUSTOMER` are used. The gateway already maps services to admin roles via `adminRoleMapping`.

**Alternative considered**: A granular permission system — rejected as overengineering for a single new access control need.

### 3. Token count: Pre-aggregated vs. on-demand query

**Decision**: Query token counts on-demand via a new endpoint `GET /notifications/token-count/:pumpuangId`.

**Rationale**: Token counts change as devices register/unregister. A count query on the indexed `pumpuangId` field in `device_tokens` is fast. The pumpuang list page can batch these calls or the backend can provide a bulk endpoint. Pre-aggregating would require maintaining a separate counter and handling race conditions.

### 4. Admin frontend: New standalone page vs. tab in existing pumpuang section

**Decision**: Two separate UI additions:
1. A new top-level "FCM Logs" page under the admin navigation (for viewing all notification logs)
2. Enhancement to the existing pumpuang list table (token count column + test send button)

**Rationale**: FCM logs are a cross-cutting concern (not specific to pumpuang), so they deserve their own navigation entry. The pumpuang-specific features (token count, test send) belong in the pumpuang list page.

## Risks / Trade-offs

- **Log volume growth** → Add TTL index on `createdAt` (e.g., 90 days) to auto-expire old logs. Can be adjusted later.
- **Test-send abuse** → Rate-limit the test-send endpoint or restrict to `ADMIN`/`DEVELOPER` roles only. Start with role restriction.
- **Token count N+1 queries on pumpuang list** → Provide a bulk token count endpoint that accepts multiple pumpuang IDs to avoid N+1. The list page can call this once with all visible IDs.
- **DEVELOPER role migration** → Existing users won't have DEVELOPER role. Admins can assign it through the existing user management. No data migration needed since it's a new value.
