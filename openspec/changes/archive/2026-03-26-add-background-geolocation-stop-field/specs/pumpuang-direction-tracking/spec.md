## MODIFIED Requirements

### Requirement: API returns direction in pumpuang responses
The `/pumpuangs/tiny` and `/pumpuangs/:id/route` API endpoints SHALL return `current.direction` as a number in their response. The `POST app/tracking` endpoint response SHALL additionally include `background_geolocation` as a `string[]` field to control the mobile app's background geolocation behavior.

#### Scenario: Tiny pumpuang response includes direction
- **WHEN** a client requests `GET /pumpuangs/tiny`
- **THEN** each pumpuang in the response SHALL include `current.direction` as a number (0-360)

#### Scenario: Route response includes direction
- **WHEN** a client requests `GET /pumpuangs/:id/route`
- **THEN** the response SHALL include `current.direction` as a number (0-360)

#### Scenario: Tracking response includes background geolocation commands
- **WHEN** the app sends a location update to `POST app/tracking`
- **THEN** the response SHALL include `background_geolocation` as a `string[]` field
