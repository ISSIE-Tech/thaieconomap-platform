## ADDED Requirements

### Requirement: React upgraded to v19
Both frontend and admin apps SHALL use React ^19.x and ReactDOM ^19.x.

#### Scenario: Frontend uses React 19
- **WHEN** inspecting apps/frontend/package.json
- **THEN** `react` and `react-dom` SHALL be ^19.x

#### Scenario: Admin uses React 19
- **WHEN** inspecting apps/admin/package.json
- **THEN** `react` and `react-dom` SHALL be ^19.x

### Requirement: forwardRef usage migrated
React 19 passes `ref` as a regular prop. All `forwardRef` wrappers SHALL be reviewed and updated where needed.

#### Scenario: Components accepting refs work correctly
- **WHEN** a component that previously used `forwardRef` receives a ref
- **THEN** the ref SHALL be properly forwarded to the target DOM element

### Requirement: Type definitions updated
All @types/react and @types/react-dom packages SHALL be updated to versions compatible with React 19.

#### Scenario: Type checking passes
- **WHEN** running TypeScript type checking across frontend and admin
- **THEN** there SHALL be no React-related type errors

### Requirement: Third-party React libraries compatible
All React-dependent libraries (react-leaflet, react-hook-form, framer-motion, react-dropzone, react-phone-number-input, etc.) SHALL be upgraded to React 19-compatible versions.

#### Scenario: Leaflet map renders
- **WHEN** loading a page with a Leaflet map component
- **THEN** the map SHALL render correctly with markers and interactions

#### Scenario: Forms work correctly
- **WHEN** interacting with react-hook-form powered forms
- **THEN** validation, submission, and error display SHALL work as before
