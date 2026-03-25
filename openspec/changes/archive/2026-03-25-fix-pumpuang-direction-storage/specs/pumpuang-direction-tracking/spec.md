## ADDED Requirements

### Requirement: Backend stores vehicle heading as direction
The backend SHALL extract `coords.heading` from the device location payload and store it as `current.direction` in the Redis pumpuang location cache.

#### Scenario: Device sends heading value
- **WHEN** the device sends a tracking update with `location.coords.heading` set to a numeric value (e.g., 180.0)
- **THEN** the backend SHALL store `current.direction` as that heading value in Redis

#### Scenario: Device sends no heading
- **WHEN** the device sends a tracking update without `location.coords.heading` (undefined)
- **THEN** the backend SHALL store `current.direction` as `0` in Redis

### Requirement: Backend stores vehicle speed
The backend SHALL extract `coords.speed` from the device location payload and store it as `current.speed` in the Redis pumpuang location cache.

#### Scenario: Device sends speed value
- **WHEN** the device sends a tracking update with `location.coords.speed` set to a numeric value
- **THEN** the backend SHALL store `current.speed` as that speed value in Redis

#### Scenario: Device sends no speed
- **WHEN** the device sends a tracking update without `location.coords.speed` (undefined)
- **THEN** the backend SHALL store `current.speed` as `0` in Redis

### Requirement: API returns direction in pumpuang responses
The `/pumpuangs/tiny` and `/pumpuangs/:id/route` API endpoints SHALL return `current.direction` as a number in their response.

#### Scenario: Tiny pumpuang response includes direction
- **WHEN** a client requests `GET /pumpuangs/tiny`
- **THEN** each pumpuang in the response SHALL include `current.direction` as a number (0-360)

#### Scenario: Route response includes direction
- **WHEN** a client requests `GET /pumpuangs/:id/route`
- **THEN** the response SHALL include `current.direction` as a number (0-360)

### Requirement: Frontend debug code is removed
The debug arrow polyline in `pumpuang-route-history.tsx` SHALL be removed before release.

#### Scenario: No debug visualization on route map
- **WHEN** the pumpuang route history map renders
- **THEN** no red dashed debug arrow polyline SHALL be visible on the map
