## 1. Shared Time Transform Utilities

- [x] 1.1 Create `minutesToTimeString` and `timeStringToMinutes` functions in `apps/admin/src/modules/economap/_utils/time-transform.ts`
- [x] 1.2 Update pumpuang edit form (`pumpuang-edit-view.tsx`) to use `minutesToTimeString` when populating opening hours default values
- [x] 1.3 Update pumpuang create/edit form submission to convert HH:MM back to integer minutes using `timeStringToMinutes` before sending to backend

## 2. Backend Force-Stop Endpoint

- [x] 2.1 Add `POST /pumpuangs/:pumpuangId/force-stop` endpoint in `PumpuangsController` with `@ExcludeRoles(UserRole.CUSTOMER)` guard
- [x] 2.2 Create `forceStopPumpuangTracking` method in `PumpuangsService` that validates status is RUNNING, then calls existing `stopPumpuangRiderTracking` logic

## 3. Frontend Force-Stop Integration

- [x] 3.1 Add force-stop endpoint to `endpoints.config.ts`
- [x] 3.2 Add `forceStopPumpuang` service function in `pumpuang.service.ts`
- [x] 3.3 Add `useForceStopPumpuang` React Query mutation hook
- [x] 3.4 Add `status` field to `PumpuangItem` type definition

## 4. Pumpuang List Status Column

- [x] 4.1 Add status column to pumpuang list table header
- [x] 4.2 Render status chip (green "กำลังวิ่ง" / grey "ไม่ได้ใช้งาน") in table row
- [x] 4.3 Add force-stop action button for RUNNING pumpuangs in the table row actions

## 5. Tracking Page Improvements

- [x] 5.1 Wrap tracking page in DashboardContent with CustomBreadcrumbs matching list page pattern
- [x] 5.2 Show active tracking alert/indicator when pumpuang status is RUNNING
- [x] 5.3 Add force-stop button on tracking page for RUNNING pumpuangs
- [x] 5.4 Refresh tracking data after force-stop
