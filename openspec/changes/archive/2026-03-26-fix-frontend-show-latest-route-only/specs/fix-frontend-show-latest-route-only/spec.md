## ADDED Requirements

### Requirement: Frontend drawer shows only latest route
The frontend pumpuang drawer SHALL display only the latest/active tracking session route, not all historical routes.

#### Scenario: Active tracking with multiple historical records
- **WHEN** the route endpoint returns multiple records
- **THEN** the frontend SHALL display only the first record's history as polylines
