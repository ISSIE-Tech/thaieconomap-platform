# pumpuang-tracking-history Specification

## Purpose
TBD - created by archiving change pumpuang-admin-crud-tracking. Update Purpose after archive.
## Requirements
### Requirement: Admin can view tracking history for a pumpuang
The system SHALL provide a tracking history page at `/dashboard/economap/pumpuang/[id]/tracking` that displays all recorded tracking sessions for a specific pumpuang. The page SHALL fetch data from `GET /services/thai-economap/pumpuangs/:id/route`.

#### Scenario: View tracking history with data
- **WHEN** admin navigates to the tracking history page for a pumpuang that has tracking records
- **THEN** the system SHALL display a list of tracking sessions with dates, and a map showing the route polyline for the selected session

#### Scenario: View tracking history with no data
- **WHEN** admin navigates to the tracking history page for a pumpuang with no tracking records
- **THEN** the system SHALL display an empty state message indicating no tracking history exists

#### Scenario: Access tracking history from pumpuang list
- **WHEN** admin views the pumpuang list or detail drawer
- **THEN** a "Tracking History" action/link SHALL be available for each pumpuang leading to its tracking page

### Requirement: Route visualization on map
The tracking history page SHALL render each tracking session's route on a Leaflet map as a polyline. The map SHALL auto-fit bounds to the route data. Location points SHALL be parsed from the `"longitude,latitude"` string format stored in tracking records.

#### Scenario: Route displayed on map
- **WHEN** admin views a tracking session with location data
- **THEN** the system SHALL render a polyline on the map connecting all tracked locations in chronological order, with the map viewport fitted to the route bounds

#### Scenario: Multiple time slots in a session
- **WHEN** a tracking session contains history grouped by multiple opening time slots
- **THEN** the system SHALL display each time slot's route, visually distinguishable (e.g., different colors or sections)

### Requirement: Admin can manage tracking history records
The system SHALL allow admins to view details of each tracking session including start time, end time, number of location points, and total distance. Admins SHALL be able to delete tracking history records if needed.

#### Scenario: View tracking session details
- **WHEN** admin selects a tracking session from the history list
- **THEN** the system SHALL display session metadata: date, location count, and the route on the map

#### Scenario: Delete tracking history record
- **WHEN** admin clicks delete on a tracking history record and confirms
- **THEN** the system SHALL remove the tracking record and update the list

