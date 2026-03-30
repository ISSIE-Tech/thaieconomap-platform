## ADDED Requirements

### Requirement: Pumpuang list table shows FCM token count
The pumpuang list table in the admin dashboard SHALL display a column showing the number of registered FCM device tokens for each pumpuang entry.

#### Scenario: Pumpuang with registered tokens
- **WHEN** the pumpuang list table loads and a pumpuang has 3 registered device tokens
- **THEN** the FCM token count column SHALL display "3" for that row

#### Scenario: Pumpuang with no registered tokens
- **WHEN** the pumpuang list table loads and a pumpuang has no registered device tokens
- **THEN** the FCM token count column SHALL display "0" for that row

### Requirement: Bulk token count endpoint
The system SHALL expose a `GET /notifications/token-counts` endpoint that accepts a list of pumpuang IDs and returns the token count for each. This avoids N+1 queries from the admin list page.

#### Scenario: Bulk token count request
- **WHEN** a client sends `GET /notifications/token-counts?ids=id1,id2,id3`
- **THEN** the system SHALL return a map of `{ "id1": 2, "id2": 0, "id3": 5 }`

### Requirement: Manual test-send button per pumpuang
The pumpuang list table SHALL include a "Test Send" button in each row. Clicking it SHALL send a test notification to all registered FCM tokens for that pumpuang.

#### Scenario: Successful test send
- **WHEN** an authorized user clicks "Test Send" for a pumpuang with registered tokens
- **THEN** the system SHALL send a test notification with title "Test Notification" and body "This is a test notification from ThaiEconoMap Admin" to all registered tokens for that pumpuang
- **AND** the system SHALL display a success message with the number of tokens notified

#### Scenario: Test send with no tokens
- **WHEN** an authorized user clicks "Test Send" for a pumpuang with no registered tokens
- **THEN** the system SHALL display a warning message indicating no tokens are registered

### Requirement: Test send endpoint
The system SHALL expose a `POST /notifications/test-send` endpoint that accepts a `pumpuangId` and sends a test notification to all registered device tokens for that pumpuang. The endpoint MUST be restricted to `ADMIN` and `DEVELOPER` roles.

#### Scenario: Test send via API
- **WHEN** an authorized user sends `POST /notifications/test-send` with `{ "pumpuangId": "abc123" }`
- **THEN** the system SHALL look up all device tokens for that pumpuang and send a test notification to each
- **AND** the system SHALL log each send attempt in the notification logs with reason "manual test"

#### Scenario: Unauthorized test send
- **WHEN** a user without `ADMIN` or `DEVELOPER` role sends `POST /notifications/test-send`
- **THEN** the system SHALL return a 403 Forbidden response
