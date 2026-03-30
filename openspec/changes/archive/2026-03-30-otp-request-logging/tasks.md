## 1. Backend - OTP Log Schema & Repository

- [x] 1.1 Add `otpLogs` to `COLLECTION_NAME` in `apps/backend/src/shared/constants/collection-property.ts`
- [x] 1.2 Create `OtpLog` Mongoose schema in `apps/backend/src/modules/otp-logs/schemas/` with fields: phoneNumber, pumpuangId, action (request/verify), status (success/failure), refno, errorMessage, createdAt (with 90-day TTL index)
- [x] 1.3 Create `OtpLogRepository` in `apps/backend/src/modules/otp-logs/repositories/` with methods: create, findPaginated (with filters for action, status, phoneNumber, date range)

## 2. Backend - OTP Log Service & Module

- [x] 2.1 Create `OtpLogService` in `apps/backend/src/modules/otp-logs/services/` that wraps the repository for log creation and querying
- [x] 2.2 Create `OtpLogsModule` with schema registration, providers, and exports
- [x] 2.3 Create `OtpLogsController` with `POST /otp/logs` endpoint for paginated query, restricted to DEVELOPER role with AuthGuard + RolesGuard

## 3. Backend - Log OTP Operations

- [x] 3.1 Import `OtpLogsModule` in `PumpuangsModule`
- [x] 3.2 Inject `OtpLogService` into `PumpuangService` and log OTP request results (success/failure with phone, pumpuangId, refno, error)
- [x] 3.3 Log OTP verify results (success/failure with phone, pumpuangId, error)

## 4. Admin Frontend - OTP Logs Page

- [x] 4.1 Add `otp` endpoints to `apps/admin/src/configs/endpoints.config.ts`
- [x] 4.2 Add OTP Logs paths to `apps/admin/src/routes/paths.ts`
- [x] 4.3 Create OTP logs service, types, and API hooks in `apps/admin/src/modules/economap/otp-logs/`
- [x] 4.4 Create OTP Logs list page component with table (phoneNumber, pumpuangId, action, status chip, refno, errorMessage, timestamp) and filters (action, status, phone search)
- [x] 4.5 Create Next.js page at `apps/admin/src/app/dashboard/economap/otp-logs/list/page.tsx` with RoleBasedGuard for DEVELOPER
- [x] 4.6 Add "OTP Logs" navigation entry under the developer section in `config-nav-dashboard.tsx`
