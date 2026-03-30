## ADDED Requirements

### Requirement: DEVELOPER role exists in the system
The system SHALL support a `DEVELOPER` value in the `UserRole` enum. This role MUST be recognized by the gateway role mapping and backend role guards.

#### Scenario: DEVELOPER role is valid
- **WHEN** a user has the `DEVELOPER` role assigned
- **THEN** the gateway and backend SHALL recognize the role as valid and apply role-based access rules accordingly

### Requirement: FCM Logs page is accessible only to authorized roles
The admin dashboard SHALL include an "FCM Logs" page that is accessible only to users with `ADMIN` or `DEVELOPER` roles. The page MUST appear in the admin navigation sidebar.

#### Scenario: ADMIN user accesses FCM Logs page
- **WHEN** a user with `ADMIN` role navigates to the admin dashboard
- **THEN** the "FCM Logs" navigation item SHALL be visible and the page SHALL load successfully

#### Scenario: DEVELOPER user accesses FCM Logs page
- **WHEN** a user with `DEVELOPER` role navigates to the admin dashboard
- **THEN** the "FCM Logs" navigation item SHALL be visible and the page SHALL load successfully

#### Scenario: MANAGER user cannot access FCM Logs page
- **WHEN** a user with `MANAGER` role navigates to the admin dashboard
- **THEN** the "FCM Logs" navigation item SHALL NOT be visible and direct URL access SHALL show an access denied message

### Requirement: FCM Logs page displays notification history
The FCM Logs page SHALL display a table of notification log entries with the following columns:
- Send To (recipient)
- Status (success/failure, with visual indicator)
- Reason
- Error Message
- Timestamp

The table MUST support:
- Pagination
- Filtering by status (success/failure)
- Filtering by date range
- Search by recipient (sendTo)

#### Scenario: Viewing notification logs
- **WHEN** an authorized user opens the FCM Logs page
- **THEN** the page SHALL display the most recent notification logs in a paginated table, sorted by timestamp descending

#### Scenario: Filtering by failure status
- **WHEN** an authorized user selects "Failure" from the status filter
- **THEN** the table SHALL show only log entries with `failure` status

#### Scenario: Searching by recipient
- **WHEN** an authorized user enters a search term in the recipient search field
- **THEN** the table SHALL filter to show only entries where `sendTo` contains the search term
