## Why

The monorepo has fallen behind on major framework versions — NestJS is on v10 (backend) with a partially mixed v11 (gateway), Next.js is on v14, React on v18, and MUI on v5. Upgrading to the latest majors (NestJS 11, Next.js 15, React 19, MUI 6) brings performance improvements, security patches, new features (React Server Components improvements, NestJS unified module system), and keeps the project within active support windows.

## What Changes

- **BREAKING** Upgrade NestJS from v10 → v11 across backend and gateway (unify gateway's mixed v10/v11 state)
- **BREAKING** Upgrade Next.js from v14 → v15 for frontend and admin apps
- **BREAKING** Upgrade React from v18 → v19 for frontend and admin apps
- **BREAKING** Upgrade MUI from v5 → v6 for frontend and admin apps
- Upgrade Mongoose from ^8.3 → latest ^8.x (minor)
- Upgrade ESLint from v8 → v9 with flat config migration
- Upgrade @typescript-eslint from v6/v7 → v8
- Upgrade all OpenTelemetry packages to latest compatible versions
- Upgrade remaining dependencies to latest compatible versions (axios, zod, zustand, tanstack/react-query, etc.)
- Align TypeScript version across all packages to ^5.7
- Align pnpm to latest stable (v9.x or v10.x)

## Capabilities

### New Capabilities

- `nestjs-v11-migration`: NestJS v10 → v11 migration covering module system changes, deprecation removals, and platform-express updates
- `nextjs-v15-migration`: Next.js v14 → v15 migration covering App Router changes, async request APIs, and caching behavior updates
- `react-v19-migration`: React v18 → v19 migration covering new hooks, ref changes, and concurrent features
- `mui-v6-migration`: MUI v5 → v6 migration covering theme changes, component API updates, and styling system updates
- `eslint-v9-migration`: ESLint v8 → v9 flat config migration across all apps

### Modified Capabilities

_(none — no existing openspec specs are affected)_

## Impact

- **All 4 apps** (backend, gateway, frontend, admin) will require code changes
- **Build tooling**: ESLint config files need rewriting to flat config format
- **CI/CD**: Node version requirement may increase; Docker base images may need updating
- **Dependencies**: Peer dependency conflicts will need resolution during upgrade
- **APIs**: No public API changes expected, but internal module wiring (NestJS) and page routing (Next.js) may need adjustments
- **Testing**: All test suites must pass after each upgrade phase
- **Dockerfiles**: Already using `node:20-alpine`, should remain compatible
