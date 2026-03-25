## 1. API & Service Layer

- [x] 1.1 Add endpoints for create, update, get-single, and route to `endpoints.config.ts`
- [x] 1.2 Add service functions: `createPumpuang`, `updatePumpuang`, `getPumpuang`, `getPumpuangRoute` in `pumpuang.service.ts`
- [x] 1.3 Add React Query hooks: `useCreatePumpuang`, `useUpdatePumpuang`, `useGetPumpuang`, `useGetPumpuangRoute`
- [x] 1.4 Add query keys for new queries to `pumpuang-query-keys.config.ts`

## 2. Pumpuang Form Component

- [x] 2.1 Create Zod validation schema for pumpuang form (name, licensePlate, owner, color, phoneNumber, opening, types, images)
- [x] 2.2 Create shared `PumpuangForm` component with React Hook Form, supporting `create` and `edit` modes
- [x] 2.3 Implement opening hours section (day/time slot management) — reference commercial module pattern
- [x] 2.4 Implement type selection (multi-select from pumpuang types)
- [x] 2.5 Implement image upload section (main image + additional images) using existing upload endpoints

## 3. Create Pumpuang Page

- [x] 3.1 Create page at `app/dashboard/economap/pumpuang/new/page.tsx`
- [x] 3.2 Wire up `PumpuangForm` in create mode with `useCreatePumpuang` hook
- [x] 3.3 Handle success redirect to list and toast notification

## 4. Edit Pumpuang Page

- [x] 4.1 Create page at `app/dashboard/economap/pumpuang/edit/[id]/page.tsx`
- [x] 4.2 Fetch existing pumpuang data with `useGetPumpuang` and populate form
- [x] 4.3 Wire up `PumpuangForm` in edit mode with `useUpdatePumpuang` hook
- [x] 4.4 Handle image add/remove during edit (upload new, delete existing)

## 5. Tracking History Page

- [x] 5.1 Create page at `app/dashboard/economap/pumpuang/[id]/tracking/page.tsx`
- [x] 5.2 Fetch tracking route data with `useGetPumpuangRoute` hook
- [x] 5.3 Create tracking session list component showing date, location count per session
- [x] 5.4 Create route map component using React Leaflet with polyline rendering
- [x] 5.5 Implement session selection — clicking a session shows its route on the map
- [x] 5.6 Handle empty state when no tracking history exists

## 6. Navigation & List Updates

- [x] 6.1 Add route paths for new pages to `routes/paths.ts`
- [x] 6.2 Add "New Pumpuang" link to sidebar navigation in `config-nav-dashboard.tsx`
- [x] 6.3 Add edit action button to pumpuang table row component
- [x] 6.4 Add tracking history action link to pumpuang table row / detail drawer

## 7. Types & Contracts

- [x] 7.1 Update pumpuang type definitions with any missing fields for create/update DTOs
- [x] 7.2 Add type definition for tracking route response data (`PumpuangLocation` / route history)
