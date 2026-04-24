## MODIFIED Requirements

### Requirement: System logs every OTP request attempt
The system SHALL persist a log entry for every OTP request. Each log entry MUST contain:
- `phoneNumber`: The phone number the OTP was sent to
- `pumpuangId`: The pumpuang ID associated with the request
- `pumpuangName`: The pumpuang owner name at the time of the request
- `action`: `request` or `verify`
- `status`: `success` or `failure`
- `refno`: The reference number from ThaiBulkSMS (for request actions)
- `errorMessage`: The error message if status is `failure`, null otherwise

#### Scenario: OTP log includes pumpuang name
- **WHEN** an OTP log entry is created
- **THEN** the entry SHALL include the `pumpuangName` field with the pumpuang owner name at the time of the event

### Requirement: OTP Logs admin page
The admin dashboard OTP Logs page SHALL display pumpuang name instead of pumpuang ID in the table.

#### Scenario: Viewing OTP logs with name
- **WHEN** a developer opens the OTP Logs page
- **THEN** the table SHALL show a "Pumpuang Name" column instead of "Pumpuang ID"
