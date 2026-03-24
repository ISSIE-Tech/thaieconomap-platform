### Requirement: Dark mode toggle switches theme visually
The admin web dark mode toggle button SHALL switch the UI between light and dark color schemes immediately upon click.

#### Scenario: Toggle from light to dark
- **WHEN** the user clicks the dark mode toggle while in light mode
- **THEN** the UI SHALL switch to the dark color scheme with dark backgrounds and light text

#### Scenario: Toggle from dark to light
- **WHEN** the user clicks the dark mode toggle while in dark mode
- **THEN** the UI SHALL switch to the light color scheme with light backgrounds and dark text

### Requirement: Theme mode persists across page refreshes
The selected color scheme SHALL persist in browser storage and be restored on page load without a flash of the wrong theme.

#### Scenario: Refresh after switching to dark mode
- **WHEN** the user switches to dark mode and refreshes the page
- **THEN** the page SHALL load in dark mode without flashing light mode first

#### Scenario: Refresh after switching to light mode
- **WHEN** the user switches to light mode and refreshes the page
- **THEN** the page SHALL load in light mode without flashing dark mode first

### Requirement: ThemeProvider uses static default mode
The `MuiThemeProvider` SHALL receive a static `defaultMode` value (not derived from dynamic settings state) to prevent MUI's internal mode from being overridden on re-renders.

#### Scenario: Settings context update does not reset MUI mode
- **WHEN** the settings context updates (e.g., colorScheme changes)
- **THEN** the `defaultMode` prop on `MuiThemeProvider` SHALL remain the static default value ('light')

### Requirement: Theme creation does not set dynamic defaultColorScheme
The `createTheme` function SHALL NOT pass a dynamic `defaultColorScheme` that changes with settings state, to avoid conflicting with MUI's internal color scheme management.

#### Scenario: Theme object created without dynamic defaultColorScheme
- **WHEN** `createTheme(settings)` is called
- **THEN** the returned theme object SHALL NOT contain a `defaultColorScheme` property derived from `settings.colorScheme`

### Requirement: Dark mode toggle available on login screen
The login screen SHALL include a dark mode toggle button so unauthenticated users can switch themes before logging in.

#### Scenario: Toggle dark mode on login page
- **WHEN** the user is on the login page and clicks the dark mode toggle
- **THEN** the login page UI SHALL switch to the opposite color scheme immediately
