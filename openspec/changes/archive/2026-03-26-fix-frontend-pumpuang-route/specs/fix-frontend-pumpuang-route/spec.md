## ADDED Requirements

### Requirement: Frontend handles array route response
The frontend `getPumpuangRouteById` service SHALL handle the backend returning an array of route records. It SHALL use the first record's `current` for the location marker, and flatten all records' `history` for polyline display.

#### Scenario: Active tracking with route data
- **WHEN** the route endpoint returns an array with one or more records
- **THEN** the frontend SHALL display the first record's current location as the car marker and render all history entries as polylines

#### Scenario: No route data
- **WHEN** the route endpoint returns an empty array or null
- **THEN** the frontend SHALL handle gracefully without errors (no marker, no polylines)
