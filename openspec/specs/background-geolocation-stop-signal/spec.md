### Requirement: Tracking response includes background_geolocation field
The `PumpuangLocationTrackingResponseDto` SHALL include a `background_geolocation` field of type `string[]` that signals the mobile app to control its background geolocation plugin.

#### Scenario: Pumpuang is INACTIVE during tracking update
- **WHEN** the app sends a location update to `POST app/tracking` and the pumpuang status is INACTIVE
- **THEN** the response SHALL include `background_geolocation: ["stop"]`

#### Scenario: Pumpuang is RUNNING during tracking update
- **WHEN** the app sends a location update to `POST app/tracking` and the pumpuang status is RUNNING
- **THEN** the response SHALL include `background_geolocation` as an empty array `[]`

### Requirement: background_geolocation field in DTO contract
The `PumpuangLocationTrackingResponseDto` in `packages/contracts` SHALL define `background_geolocation` as a required `string[]` field alongside the existing `location` and `status` fields.

#### Scenario: DTO type includes background_geolocation
- **WHEN** a consumer imports `PumpuangLocationTrackingResponseDto` from contracts
- **THEN** the type SHALL include `background_geolocation: string[]`
