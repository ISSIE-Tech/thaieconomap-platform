## ADDED Requirements

### Requirement: Shared time conversion utilities
The system SHALL provide shared utility functions for converting between backend integer minutes-since-midnight format and HH:MM string format. These functions SHALL be used by all economap forms that handle opening hours.

#### Scenario: Convert minutes to time string
- **WHEN** the system receives an opening time value of 540 from the backend
- **THEN** `minutesToTimeString(540)` SHALL return `"09:00"`

#### Scenario: Convert time string to minutes
- **WHEN** the user enters "17:30" in the opening time form
- **THEN** `timeStringToMinutes("17:30")` SHALL return `1050`

#### Scenario: Edge case midnight
- **WHEN** the system receives 0 minutes from the backend
- **THEN** `minutesToTimeString(0)` SHALL return `"00:00"`

### Requirement: Pumpuang edit form uses correct time format
The pumpuang edit form SHALL properly convert backend integer minutes to HH:MM format when populating default values, and convert HH:MM back to integer minutes when submitting. The pumpuang create form submission SHALL also convert HH:MM to integer minutes.

#### Scenario: Edit form populates correct time
- **WHEN** admin opens the edit form for a pumpuang with opening hours `{ open: 540, close: 1020 }`
- **THEN** the form SHALL display "09:00" for open time and "17:00" for close time

#### Scenario: Form submission converts time correctly
- **WHEN** admin submits the form with openTime "08:30" and closeTime "18:00"
- **THEN** the submitted data SHALL contain opening hours with `open: 510` and `close: 1080` in integer minutes format
