## Context

The ThaiEconoMap backend is a NestJS application with MongoDB, serving the Pumpuang mobile app for rider tracking and commercial data. External service integrations (SMS via ThaiBulkSMS, analytics forwarding, gateway) follow a consistent pattern: dedicated service classes injecting `ConfigService` for env-based configuration, with error logging and graceful failure handling.

There is currently no push notification capability. The Pumpuang mobile app needs FCM push notifications for real-time alerts (order updates, announcements, location-based triggers). Firebase Admin SDK will be used server-side to send messages via FCM.

## Goals / Non-Goals

**Goals:**
- Provide a reusable `NotificationsModule` that any module can import to send push notifications
- Support sending to individual devices (by FCM token) and to FCM topics
- Store and manage device tokens per user so notifications can be targeted by user identity
- Load all FCM credentials from environment variables, following the existing Joi validation pattern
- Follow existing project conventions (module structure, error codes, DTOs, Swagger docs)

**Non-Goals:**
- In-app notification inbox or notification history persistence (future work)
- SMS or email notifications (already handled by ThaiBulkSMS / separate concern)
- Scheduled/delayed notifications or notification queuing (can be added later with `@nestjs/schedule`)
- Client-side FCM setup or mobile app changes (separate repo)
- Admin UI for composing notifications

## Decisions

### 1. Firebase Admin SDK via `firebase-admin` npm package

**Choice:** Use the official `firebase-admin` Node.js SDK to send FCM messages.

**Alternatives considered:**
- Raw HTTP calls to FCM v1 API via `@nestjs/axios` — more control but requires manual OAuth2 token management and retries
- Third-party wrapper libraries — adds unnecessary abstraction over an already simple SDK

**Rationale:** `firebase-admin` handles authentication (service account), token refresh, and provides typed methods for `messaging.send()` and `messaging.sendEachForMulticast()`. It's the recommended approach from Google and the most battle-tested.

### 2. Service account credentials via environment variables

**Choice:** Pass FCM credentials as individual env vars (`FCM_PROJECT_ID`, `FCM_CLIENT_EMAIL`, `FCM_PRIVATE_KEY`) rather than a JSON file path.

**Alternatives considered:**
- `GOOGLE_APPLICATION_CREDENTIALS` file path — requires a JSON file on disk, complicates containerized deployments and CI/CD secrets management
- Base64-encoded JSON in a single env var — harder to rotate individual fields

**Rationale:** The project already manages all secrets via env vars with Joi validation. Individual vars are easier to manage in Docker/K8s secrets and `.env` files. The `firebase-admin` SDK supports `credential: cert({ projectId, clientEmail, privateKey })` initialization.

### 3. Dedicated `notifications` module (not embedded in `externals`)

**Choice:** Create a new `src/modules/notifications/` module rather than adding to the existing `ExternalModule`.

**Alternatives considered:**
- Add FCM service to `ExternalModule` — keeps external integrations together but `ExternalModule` uses `HttpModule` for REST calls, while FCM uses `firebase-admin` SDK (different pattern)

**Rationale:** The notifications module has its own schema (device tokens), DTOs, and controller endpoints. It's a distinct domain with its own data model, not just an HTTP client wrapper. Other modules (pumpuangs, announcements) will import `NotificationsModule` to send notifications — it's a first-class capability.

### 4. Separate MongoDB collection for device tokens

**Choice:** Create a `DeviceToken` schema/collection linking `userId` (or `pumpuangId`) to one or more FCM tokens, with platform metadata.

**Alternatives considered:**
- Embed tokens array in the existing User/Pumpuang schema — simpler but couples token lifecycle to user document, makes token cleanup queries harder, and bloats user documents

**Rationale:** Device tokens have their own lifecycle (register on login, remove on logout, invalidate on FCM error). A separate collection allows efficient queries (find all tokens for a user, bulk cleanup of stale tokens) and keeps user documents lean. Follows the existing pattern of one collection per domain concern.

### 5. Fire-and-forget pattern for triggered notifications

**Choice:** When other modules trigger a notification (e.g., pumpuangs location update), the call is fire-and-forget — errors are logged but don't fail the parent operation.

**Rationale:** Consistent with the existing `LocationAnalyticsService` pattern. A failed push notification should never block a business operation. The notification service will log errors and handle token invalidation (remove stale tokens) silently.

## Risks / Trade-offs

- **FCM token staleness** → Implement token cleanup on `messaging/registration-token-not-registered` errors from FCM. Tokens are removed automatically when FCM reports them invalid.
- **Private key formatting in env vars** → `FCM_PRIVATE_KEY` contains newlines. Must document that the value needs `\n` literals or proper escaping in `.env`. Validate on module init.
- **No retry mechanism** → Initial implementation does not retry failed sends. If reliability becomes critical, a queue-based approach (Bull/Redis) can be added later.
- **Single Firebase project** → Design assumes one FCM project. Multi-project support is not needed now but the service can be extended if required.

### 6. FCM token routes under pumpuang app namespace

**Choice:** Place device token registration/removal endpoints under `/pumpuangs/app/fcm-token` (protected by `PumpuangJwtAccessGuard`) rather than `/notifications/tokens`.

**Alternatives considered:**
- Generic `/notifications/tokens` with `userId` in body — doesn't match the pumpuang app convention where all mobile-facing routes live under `/pumpuangs/app/*` and the identity comes from the JWT

**Rationale:** The Pumpuang mobile app is the primary consumer of FCM token management. All existing app routes (`/pumpuangs/app/tracking`, `/pumpuangs/app/profile`, `/pumpuangs/app/auth/*`) use `PumpuangJwtAccessGuard` and extract the `pumpuangId` from the JWT `sub` claim. Token registration follows this same pattern — the mobile app calls `PUT /pumpuangs/app/fcm-token` after login, and `DELETE /pumpuangs/app/fcm-token` on logout. The send endpoints (`/notifications/send`, `/notifications/send-topic`) remain in the notifications controller as internal/admin APIs.

## Open Questions

- What notification topics are needed initially? (e.g., `announcements`, `pumpuang-updates`) — to be defined during implementation
