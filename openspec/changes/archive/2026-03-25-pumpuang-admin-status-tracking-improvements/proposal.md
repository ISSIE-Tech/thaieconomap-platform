## Why

The admin pumpuang management has several UX and data issues:
1. Admins cannot see which pumpuangs are currently tracking (RUNNING vs INACTIVE status) in the list
2. Admins cannot force-stop a running pumpuang's tracking — only the pumpuang app can stop it
3. The tracking history page is missing DashboardContent wrapper causing inconsistent layout/margins compared to other pages
4. The opening hours form incorrectly handles the backend's integer minutes-since-midnight format (e.g., 540 = 09:00), displaying raw integers instead of HH:MM

## What Changes

- Add `status` (RUNNING/INACTIVE) column to the pumpuang list table
- Show "กำลังวิ่ง" (Active) label on tracking page when pumpuang is currently tracking
- Add admin endpoint to force-stop pumpuang tracking (set status to INACTIVE and flush location cache)
- Add force-stop button in admin list and tracking page for RUNNING pumpuangs
- Wrap tracking page in DashboardContent with breadcrumbs to match other pages
- Create shared utility functions for converting between integer minutes-since-midnight and HH:MM string format
- Fix pumpuang edit form to properly convert backend opening time integers to HH:MM and back

## Capabilities

### New Capabilities
- `pumpuang-admin-force-stop`: Admin ability to force-stop a running pumpuang's location tracking, including new backend endpoint and admin UI controls
- `pumpuang-time-transform`: Shared utility for converting between backend integer minutes (0-1439) and HH:MM display format, used by pumpuang forms

### Modified Capabilities

## Impact

- **Backend** (`apps/backend`): New admin endpoint `POST /pumpuangs/:id/force-stop` in PumpuangsController
- **Admin frontend** (`apps/admin`): Updated pumpuang list table, tracking page layout, edit form time handling
- **Shared utils**: New time conversion utilities in admin app
- **Endpoints config**: New endpoint entry for force-stop
