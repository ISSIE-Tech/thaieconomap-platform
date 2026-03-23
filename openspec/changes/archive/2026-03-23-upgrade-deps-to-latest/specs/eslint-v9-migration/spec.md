## ADDED Requirements

### Requirement: ESLint upgraded to v9
All apps SHALL use ESLint ^9.x with the new flat config format.

#### Scenario: ESLint v9 installed across all apps
- **WHEN** inspecting package.json files for all apps
- **THEN** eslint SHALL be ^9.x

### Requirement: Flat config files created
All `.eslintrc.*` config files SHALL be replaced with `eslint.config.mjs` (or `.js`) using the flat config format.

#### Scenario: Legacy config files removed
- **WHEN** searching the repo for `.eslintrc`, `.eslintrc.js`, `.eslintrc.json`, or `.eslintrc.yaml`
- **THEN** no legacy config files SHALL exist

#### Scenario: Flat config files present
- **WHEN** checking each app directory
- **THEN** each app SHALL have an `eslint.config.mjs` or `eslint.config.js` file

### Requirement: @typescript-eslint upgraded to v8
@typescript-eslint/eslint-plugin and @typescript-eslint/parser SHALL be upgraded to ^8.x across all apps.

#### Scenario: TypeScript-ESLint v8 installed
- **WHEN** inspecting devDependencies
- **THEN** @typescript-eslint/eslint-plugin and @typescript-eslint/parser SHALL be ^8.x

### Requirement: Linting passes
All existing lint rules SHALL be preserved (or replaced with v9 equivalents). Running the linter SHALL produce no new errors.

#### Scenario: Lint check passes
- **WHEN** running lint command for each app
- **THEN** the linter SHALL pass with the same or fewer errors than before the upgrade
