## Why

The admin dashboard currently only supports listing pumpuangs and approving/rejecting/deleting them. Admins cannot create new pumpuangs, edit existing pumpuang data, or view tracking history. This limits operational capability — admins need full CRUD control over pumpuang records and visibility into tracking routes to manage the service effectively.

## What Changes

- Add **create pumpuang** page in admin with form for all pumpuang fields (name, license plate, owner, color, phone, opening hours, types, images)
- Add **edit pumpuang** page in admin to modify existing pumpuang data
- Add **view/detail** page for individual pumpuang showing all data
- Add **tracking history** view per pumpuang showing route history with map visualization
- Admin can view, filter, and manage closed tracking sessions (tracking history records)
- Wire up existing backend endpoints (`POST /pumpuangs`, `PUT /pumpuangs/:id`, `GET /pumpuangs/:id/route`) to admin frontend
- Add navigation entries for new pages

## Capabilities

### New Capabilities
- `pumpuang-admin-crud`: Full create/read/update/delete operations for pumpuang records in the admin dashboard, including form validation, image upload, and opening hours management
- `pumpuang-tracking-history`: View and manage tracking history per pumpuang, including route visualization on a map and session details

### Modified Capabilities
<!-- No existing spec-level requirements are changing -->

## Impact

- **Admin frontend** (`apps/admin`): New pages, components, services, and hooks in `src/modules/economap/pumpuang/`
- **Routes**: New routes at `/dashboard/economap/pumpuang/new`, `/dashboard/economap/pumpuang/edit/[id]`, `/dashboard/economap/pumpuang/[id]/tracking`
- **Navigation**: Update `config-nav-dashboard.tsx` with new menu items
- **API endpoints used**: Existing backend endpoints — no backend changes needed
- **Dependencies**: Leaflet/React Leaflet (already installed) for tracking route map visualization
