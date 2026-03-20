### Requirement: Register a device token via pumpuang app
The system SHALL provide an API endpoint at `PUT /pumpuangs/app/fcm-token` to register or update an FCM device token for the authenticated pumpuang. The `pumpuangId` MUST be extracted from the JWT access token (not passed in the request body). The endpoint MUST be protected by `PumpuangJwtAccessGuard`.

#### Scenario: Register a new device token
- **WHEN** an authenticated pumpuang sends a PUT request to `/pumpuangs/app/fcm-token` with `token` and optional `platform` ("ios" or "android")
- **THEN** the system SHALL create a new device token record linked to the authenticated `pumpuangId`
- **AND** return a 200 success response

#### Scenario: Register a duplicate token for the same pumpuang
- **WHEN** an authenticated pumpuang sends a PUT request with a `token` that already exists for their `pumpuangId`
- **THEN** the system SHALL update the `updatedAt` timestamp of the existing record
- **AND** return a success response (upsert behavior, no duplicate created)

#### Scenario: Register the same token for a different pumpuang
- **WHEN** an authenticated pumpuang sends a PUT request with a `token` that is already registered to a different pumpuang
- **THEN** the system SHALL reassign the token to the current pumpuang (a device can only belong to one pumpuang)
- **AND** the previous pumpuang's record for that token SHALL be removed

### Requirement: Remove a device token via pumpuang app
The system SHALL provide an API endpoint at `DELETE /pumpuangs/app/fcm-token` to remove the FCM device token for the authenticated pumpuang, typically called on logout or token revocation. The endpoint MUST be protected by `PumpuangJwtAccessGuard`.

#### Scenario: Remove an existing token
- **WHEN** an authenticated pumpuang sends a DELETE request to `/pumpuangs/app/fcm-token` with `token` in the request body
- **THEN** the system SHALL delete the device token record from the database
- **AND** return a 200 success response

#### Scenario: Remove a non-existent token
- **WHEN** an authenticated pumpuang sends a DELETE request for a token that does not exist in the database
- **THEN** the system SHALL return a 200 success response (idempotent)

### Requirement: Query device tokens for a pumpuang
The system SHALL provide an internal method to retrieve all registered device tokens for a given `pumpuangId`. This is used internally by the notification sending service, not exposed as an API endpoint.

#### Scenario: Pumpuang has registered devices
- **WHEN** device tokens are queried for a pumpuang who has 3 registered devices
- **THEN** the system SHALL return an array of 3 token strings

#### Scenario: Pumpuang has no registered devices
- **WHEN** device tokens are queried for a pumpuang with no registered devices
- **THEN** the system SHALL return an empty array

### Requirement: Device token schema
The system SHALL store device tokens in a dedicated MongoDB collection with the following fields: `pumpuangId` (required, indexed), `token` (required, unique), `platform` (optional, enum: "ios" | "android"), `createdAt`, and `updatedAt`.

#### Scenario: Token uniqueness enforced
- **WHEN** two records with the same `token` value are attempted to be inserted
- **THEN** the database SHALL enforce uniqueness and prevent the duplicate

#### Scenario: Query by pumpuangId is efficient
- **WHEN** device tokens are queried by `pumpuangId`
- **THEN** the query SHALL use the index on `pumpuangId` for efficient lookup

### Requirement: Automatic cleanup of invalid tokens
The system SHALL remove device tokens from the database when FCM reports them as invalid during a send operation.

#### Scenario: Token invalidated by FCM
- **WHEN** an FCM send returns `messaging/registration-token-not-registered` for a specific token
- **THEN** the system SHALL delete that token from the device tokens collection
- **AND** log a warning with the removed token details

#### Scenario: Bulk send with some invalid tokens
- **WHEN** a multicast send reports 2 out of 5 tokens as invalid
- **THEN** the system SHALL remove exactly those 2 invalid tokens from the database
- **AND** the remaining 3 valid tokens SHALL not be affected
