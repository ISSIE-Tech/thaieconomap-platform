# pumpuang-admin-crud Specification

## Purpose
TBD - created by archiving change pumpuang-admin-crud-tracking. Update Purpose after archive.
## Requirements
### Requirement: Admin can create a new pumpuang
The system SHALL provide a create form at `/dashboard/economap/pumpuang/new` allowing admins to create a new pumpuang record with all required fields: name, license plate, owner, color, phone number, opening hours, types, and images. The form SHALL validate inputs using Zod schema before submission. On successful creation, the system SHALL redirect to the pumpuang list and show a success toast.

#### Scenario: Successful pumpuang creation
- **WHEN** admin fills in all required fields (name, license plate, owner, color, phone number, at least one opening hour, at least one type) and submits the form
- **THEN** the system calls `POST /services/thai-economap/pumpuangs` with the form data, redirects to the pumpuang list page, and displays a success notification

#### Scenario: Validation failure on create
- **WHEN** admin submits the form with missing required fields
- **THEN** the system SHALL display inline validation errors on the invalid fields and NOT submit the request

#### Scenario: Image upload during creation
- **WHEN** admin uploads images in the create form
- **THEN** the system SHALL upload each image via `POST /services/thai-economap/pumpuangs/upload-additional-image` and include the returned URLs in the pumpuang data

### Requirement: Admin can edit an existing pumpuang
The system SHALL provide an edit form at `/dashboard/economap/pumpuang/edit/[id]` pre-populated with the pumpuang's current data. The form SHALL allow modifying all fields. On successful update, the system SHALL redirect to the pumpuang list and show a success toast.

#### Scenario: Successful pumpuang edit
- **WHEN** admin modifies fields on an existing pumpuang and submits
- **THEN** the system calls `PUT /services/thai-economap/pumpuangs/:id` with the updated data, redirects to the pumpuang list, and displays a success notification

#### Scenario: Edit form loads existing data
- **WHEN** admin navigates to `/dashboard/economap/pumpuang/edit/[id]`
- **THEN** the system SHALL fetch the pumpuang via `GET /services/thai-economap/pumpuangs/:id` and populate all form fields with current values

#### Scenario: Image management during edit
- **WHEN** admin removes an existing image from the edit form
- **THEN** the system SHALL call `DELETE /services/thai-economap/pumpuangs/:id/delete-additional-image` to remove the image

### Requirement: Admin can view pumpuang detail
The system SHALL allow admins to view full pumpuang details either via a detail drawer on the list page or by navigating to the edit page. The detail view SHALL display all pumpuang fields including images, opening hours, types, status, and metadata (created by, approved by, dates).

#### Scenario: View pumpuang detail from list
- **WHEN** admin clicks on a pumpuang row in the list
- **THEN** the system SHALL display the pumpuang detail drawer showing all fields and an action to navigate to edit page

### Requirement: Navigation includes CRUD pages
The dashboard navigation SHALL include links to the pumpuang create page. The pumpuang list table rows SHALL include an edit action link. Navigation paths SHALL be added to the routes configuration.

#### Scenario: Create link in navigation
- **WHEN** admin views the economap pumpuang section in the sidebar
- **THEN** a "New Pumpuang" or equivalent link SHALL be visible leading to the create page

#### Scenario: Edit link in table row
- **WHEN** admin views the pumpuang list table
- **THEN** each row SHALL have an edit action (icon button or menu item) linking to `/dashboard/economap/pumpuang/edit/[id]`

