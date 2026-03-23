## 1. Gateway NestJS v11 Unification

- [x] 1.1 Upgrade all @nestjs/* packages in apps/gateway to ^11.x (common, core, platform-express, config, jwt, mongoose, passport, swagger, axios, mapped-types)
- [x] 1.2 Upgrade @nestjs/cli, @nestjs/schematics, @nestjs/testing devDependencies to ^11.x
- [x] 1.3 Fix any NestJS v11 API breaking changes in gateway source code
- [x] 1.4 Run gateway tests and verify all pass

## 2. Backend NestJS v10 → v11

- [x] 2.1 Upgrade all @nestjs/* packages in apps/backend to ^11.x (common, core, platform-express, config, jwt, mongoose, passport, swagger, throttler, schedule, cache-manager, axios)
- [x] 2.2 Upgrade @nestjs/cli, @nestjs/schematics, @nestjs/testing devDependencies to ^11.x
- [x] 2.3 Upgrade nestjs-otel to NestJS v11-compatible version
- [x] 2.4 Upgrade cache-manager-redis-yet and verify CacheModule compatibility
- [x] 2.5 Fix any NestJS v11 API breaking changes in backend source code
- [x] 2.6 Run backend tests and verify all pass

## 3. React v18 → v19

- [x] 3.1 Upgrade react and react-dom to ^19.x in apps/frontend
- [x] 3.2 Upgrade react and react-dom to ^19.x in apps/admin
- [x] 3.3 Upgrade @types/react and @types/react-dom to React 19-compatible versions
- [x] 3.4 Audit and update forwardRef usage across frontend and admin
- [x] 3.5 Upgrade React-dependent libraries to React 19-compatible versions (react-leaflet, react-hook-form, framer-motion, react-dropzone, react-phone-number-input, react-window, react-apexcharts, react-map-gl, etc.)
- [x] 3.6 Verify frontend builds and renders correctly
- [x] 3.7 Verify admin builds and renders correctly

## 4. Next.js v14 → v15

- [x] 4.1 Upgrade next to ^15.x in apps/frontend
- [x] 4.2 Upgrade next to ^15.x in apps/admin
- [x] 4.3 Migrate async request APIs — update all cookies(), headers(), params, searchParams usages to async in frontend
- [x] 4.4 Migrate async request APIs in admin
- [x] 4.5 Review and update fetch caching behavior (add explicit cache directives where needed)
- [x] 4.6 Run `next build` for frontend and verify success
- [x] 4.7 Run `next build` for admin and verify success

## 5. MUI v5 → v7

- [x] 5.1 Upgrade @mui/material to ^7.x in apps/frontend
- [x] 5.2 Upgrade @mui/lab, @mui/x-data-grid, @mui/x-date-pickers, @mui/x-tree-view to MUI v7-compatible versions in frontend
- [x] 5.3 Upgrade all @mui/* packages in apps/admin to v7-compatible versions
- [x] 5.4 Upgrade @emotion/react and @emotion/styled to versions compatible with MUI v7
- [x] 5.5 Run MUI codemods for v5 → v7 migration on frontend
- [x] 5.6 Run MUI codemods for v5 → v7 migration on admin
- [x] 5.7 Update custom theme configuration for MUI v7 API changes
- [x] 5.8 Fix any remaining MUI component API deprecations manually
- [x] 5.9 Verify frontend builds and all MUI components render correctly
- [x] 5.10 Verify admin builds and all MUI components render correctly

## 6. ESLint v8 → v9 with Flat Config

- [x] 6.1 Upgrade eslint to ^9.x across all apps
- [x] 6.2 Upgrade @typescript-eslint/eslint-plugin and @typescript-eslint/parser to ^8.x across all apps
- [x] 6.3 Convert backend .eslintrc to eslint.config.mjs
- [x] 6.4 Convert gateway .eslintrc to eslint.config.mjs
- [x] 6.5 Convert frontend .eslintrc to eslint.config.mjs
- [x] 6.6 Convert admin .eslintrc to eslint.config.mjs
- [x] 6.7 Upgrade eslint plugins (eslint-plugin-import, eslint-plugin-prettier, eslint-plugin-sonarjs, eslint-plugin-unused-imports, eslint-plugin-react, eslint-plugin-react-hooks) to v9-compatible versions
- [x] 6.8 Remove legacy .eslintrc files after migration
- [x] 6.9 Run lint across all apps and verify no new errors

## 7. Remaining Dependency Upgrades

- [x] 7.1 Align TypeScript to ^5.7 across all packages
- [x] 7.2 Upgrade Mongoose to latest ^8.x in backend and gateway
- [x] 7.3 Upgrade OpenTelemetry packages to latest compatible versions
- [x] 7.4 Upgrade remaining minor dependencies (axios, zod, zustand, @tanstack/react-query, dayjs, etc.)
- [x] 7.5 Update pnpm version in package.json packageManager field
- [x] 7.6 Run `pnpm install` and resolve any peer dependency conflicts
- [x] 7.7 Run full test suite across all apps and verify everything passes
