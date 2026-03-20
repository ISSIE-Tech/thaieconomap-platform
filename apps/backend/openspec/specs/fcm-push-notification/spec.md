### Requirement: Firebase Admin SDK initialization
The system SHALL initialize the Firebase Admin SDK on module startup using service account credentials loaded from environment variables (`FCM_PROJECT_ID`, `FCM_CLIENT_EMAIL`, `FCM_PRIVATE_KEY`). The system SHALL validate that all required credentials are present and log a warning if FCM is not configured.

#### Scenario: Successful initialization with valid credentials
- **WHEN** the NotificationsModule starts and `FCM_PROJECT_ID`, `FCM_CLIENT_EMAIL`, and `FCM_PRIVATE_KEY` are all set
- **THEN** the Firebase Admin SDK SHALL be initialized with the provided service account credentials
- **AND** a log message SHALL confirm successful FCM initialization

#### Scenario: Missing FCM credentials
- **WHEN** the NotificationsModule starts and any of `FCM_PROJECT_ID`, `FCM_CLIENT_EMAIL`, or `FCM_PRIVATE_KEY` is missing
- **THEN** the system SHALL log a warning indicating FCM is not configured
- **AND** the module SHALL still start without crashing (graceful degradation)
- **AND** all send operations SHALL return silently without attempting to send

### Requirement: Send notification to a single device
The system SHALL provide a method to send a push notification to a single device identified by its FCM token. The payload MUST include a title and body, and MAY include optional data fields.

#### Scenario: Successful send to a valid token
- **WHEN** a notification is sent with a valid FCM token, title, and body
- **THEN** the system SHALL call Firebase Messaging `send()` with the constructed message
- **AND** the send result SHALL be logged at debug level

#### Scenario: Send to an invalid or expired token
- **WHEN** a notification is sent and FCM returns a `messaging/registration-token-not-registered` error
- **THEN** the system SHALL log a warning with the invalid token
- **AND** the system SHALL remove the invalid token from the device tokens collection
- **AND** the error SHALL NOT propagate to the caller

#### Scenario: FCM service unavailable
- **WHEN** a notification send fails due to a transient FCM error (network, server error)
- **THEN** the system SHALL log the error
- **AND** the error SHALL NOT propagate to the caller (fire-and-forget)

### Requirement: Send notification to multiple devices
The system SHALL provide a method to send a push notification to multiple device tokens in a single call using `sendEachForMulticast()`.

#### Scenario: Multicast send with mixed results
- **WHEN** a notification is sent to multiple tokens and some succeed while others fail
- **THEN** the system SHALL log the success and failure counts
- **AND** tokens that failed with `messaging/registration-token-not-registered` SHALL be removed from the device tokens collection

#### Scenario: Multicast send with empty token list
- **WHEN** a notification is requested for a user who has no registered device tokens
- **THEN** the system SHALL skip the send and log a debug message
- **AND** no error SHALL be raised

### Requirement: Send notification to a topic
The system SHALL provide a method to send a push notification to an FCM topic. Topics allow broadcasting to all devices subscribed to that topic.

#### Scenario: Successful topic send
- **WHEN** a notification is sent to topic `announcements` with a title and body
- **THEN** the system SHALL call Firebase Messaging `send()` with `topic: "announcements"` in the message
- **AND** the result SHALL be logged at debug level

#### Scenario: Send to topic when FCM is not configured
- **WHEN** a topic notification is requested but FCM was not initialized (missing credentials)
- **THEN** the system SHALL return silently without error

### Requirement: Notification API endpoint for sending to a pumpuang
The system SHALL expose a REST endpoint at `POST /notifications/send` for sending push notifications to a specific pumpuang. The endpoint MUST be protected by the existing API key guard. This is an internal/admin endpoint, not called by the mobile app directly.

#### Scenario: Send notification to a specific pumpuang
- **WHEN** a POST request is made to `/notifications/send` with a valid payload containing `pumpuangId`, `title`, `body`, and optional `data`
- **THEN** the system SHALL look up all device tokens for the given `pumpuangId`
- **AND** send the notification to all registered devices
- **AND** return a success response

#### Scenario: Send notification with missing required fields
- **WHEN** a POST request is made to `/notifications/send` without `title` or `body`
- **THEN** the system SHALL return a 400 validation error

### Requirement: Notification API endpoint for sending to a topic
The system SHALL expose a REST endpoint at `POST /notifications/send-topic` for broadcasting push notifications to an FCM topic. The endpoint MUST be protected by the existing API key guard.

#### Scenario: Send notification to a topic
- **WHEN** a POST request is made to `/notifications/send-topic` with a valid payload containing `topic`, `title`, `body`, and optional `data`
- **THEN** the system SHALL send the notification to the specified FCM topic
- **AND** return a success response
