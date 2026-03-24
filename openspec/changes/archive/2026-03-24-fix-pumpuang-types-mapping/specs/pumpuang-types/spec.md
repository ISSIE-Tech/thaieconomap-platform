## ADDED Requirements

### Requirement: Pumpuang types field returns populated objects

The pumpuang profile response `types` field SHALL return an array of objects with `_id` and `name` properties, not an array of strings.

#### Scenario: Types in pumpuang profile response
- **WHEN** any endpoint returns a pumpuang profile (e.g., OTP verify, get profile)
- **THEN** the `types` field SHALL be `[{"_id": "<objectId>", "name": "<type name>"}]`

#### Scenario: Types in pending pumpuang response
- **WHEN** any endpoint returns a pending pumpuang profile
- **THEN** the `types` field SHALL be `[{"_id": "<objectId>", "name": "<type name>"}]`

#### Scenario: Unpopulated types fallback
- **WHEN** types are not populated (raw ObjectIds)
- **THEN** the mapper SHALL return `{"_id": "<objectId>"}` with `name` as `undefined`
