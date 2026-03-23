# MUI v6 Migration

## Purpose
Upgrade all MUI packages in frontend and admin apps from v5 to v6, including theme and component API migrations.

## Requirements

### Requirement: MUI upgraded to v6
All @mui/* packages in frontend and admin SHALL be upgraded to v6-compatible versions.

#### Scenario: Frontend MUI packages are v6
- **WHEN** inspecting apps/frontend/package.json
- **THEN** @mui/material SHALL be ^6.x, @mui/lab, @mui/x-data-grid, @mui/x-date-pickers, and @mui/x-tree-view SHALL be compatible v7.x/v8.x versions

#### Scenario: Admin MUI packages are v6
- **WHEN** inspecting apps/admin/package.json
- **THEN** all @mui/* packages SHALL be upgraded to MUI v6-compatible versions

### Requirement: Theme configuration updated
MUI v6 theme API changes SHALL be applied. Any deprecated theme options SHALL be replaced with v6 equivalents.

#### Scenario: Custom theme loads without errors
- **WHEN** the application starts with the custom theme
- **THEN** all theme values SHALL apply correctly and no MUI console warnings SHALL appear

### Requirement: Component API migrations applied
Deprecated MUI v5 component props and patterns SHALL be updated to v6 equivalents. MUI codemods SHALL be run where applicable.

#### Scenario: Data grid renders correctly
- **WHEN** loading a page with MUI X Data Grid
- **THEN** the grid SHALL render with sorting, filtering, and pagination working

#### Scenario: Date pickers work
- **WHEN** using MUI X Date Pickers
- **THEN** date selection, validation, and formatting SHALL work correctly

### Requirement: Emotion compatibility maintained
@emotion/react and @emotion/styled SHALL be upgraded to versions compatible with MUI v6 and React 19.

#### Scenario: Styled components render
- **WHEN** components using @emotion/styled or the `sx` prop render
- **THEN** styles SHALL apply correctly without hydration mismatches
