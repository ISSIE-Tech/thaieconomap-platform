# pumpuang-admin-force-stop Specification

## Purpose
TBD - created by archiving change pumpuang-admin-status-tracking-improvements. Update Purpose after archive.
## Requirements
### Requirement: Admin can see pumpuang tracking status in list
The pumpuang list table SHALL display the current tracking status (RUNNING/INACTIVE) for each approved pumpuang. RUNNING status SHALL be displayed as a colored label/chip.

#### Scenario: Running pumpuang shown in list
- **WHEN** admin views the pumpuang list and a pumpuang has status RUNNING
- **THEN** the table SHALL display a "กำลังวิ่ง" label with a success/green color indicator

#### Scenario: Inactive pumpuang shown in list
- **WHEN** admin views the pumpuang list and a pumpuang has status INACTIVE
- **THEN** the table SHALL display a "ไม่ได้ใช้งาน" label with a default/grey color indicator

### Requirement: Admin can force-stop pumpuang tracking
The system SHALL provide a backend endpoint `POST /pumpuangs/:pumpuangId/force-stop` accessible to admin users (ExcludeRoles CUSTOMER). This endpoint SHALL stop the pumpuang's location tracking, flush cached location data to MongoDB, and set status to INACTIVE. The admin frontend SHALL expose this action in the list table and tracking page.

#### Scenario: Force-stop from list table
- **WHEN** admin clicks the force-stop button on a RUNNING pumpuang in the list table and confirms
- **THEN** the system SHALL call the force-stop endpoint, the pumpuang status SHALL change to INACTIVE, and the list SHALL refresh

#### Scenario: Force-stop from tracking page
- **WHEN** admin views the tracking page of a RUNNING pumpuang and clicks force-stop
- **THEN** the system SHALL call the force-stop endpoint and update the page to reflect INACTIVE status

#### Scenario: Force-stop on already inactive pumpuang
- **WHEN** admin attempts to force-stop a pumpuang that is already INACTIVE
- **THEN** the system SHALL return an error indicating the pumpuang is not running

### Requirement: Active tracking label on tracking page
The tracking page SHALL display a prominent "กำลังวิ่งอยู่" (Active) indicator when the pumpuang's current status is RUNNING.

#### Scenario: Tracking page for running pumpuang
- **WHEN** admin views the tracking page and the pumpuang status is RUNNING
- **THEN** the page SHALL display an active tracking indicator (e.g., alert or chip) and a force-stop button

#### Scenario: Tracking page for inactive pumpuang
- **WHEN** admin views the tracking page and the pumpuang status is INACTIVE
- **THEN** the page SHALL NOT display the active tracking indicator or force-stop button

### Requirement: Tracking page layout matches dashboard
The tracking page SHALL be wrapped in DashboardContent with CustomBreadcrumbs, matching the layout pattern used by the pumpuang list page and other dashboard pages.

#### Scenario: Tracking page has consistent layout
- **WHEN** admin navigates to the tracking page
- **THEN** the page SHALL have the same padding, max-width, and breadcrumb navigation as the pumpuang list page

