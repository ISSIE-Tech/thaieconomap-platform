## ADDED Requirements

### Requirement: Root CI orchestrates child pipelines
The root `.gitlab-ci.yml` SHALL trigger each app's pipeline as a child pipeline using `trigger: include: local`.

#### Scenario: Root CI triggers backend pipeline
- **WHEN** a commit changes files in `apps/backend/`
- **THEN** the root CI triggers `apps/backend/.gitlab-ci.yml` as a child pipeline

#### Scenario: Root CI triggers gateway pipeline
- **WHEN** a commit changes files in `apps/gateway/`
- **THEN** the root CI triggers `apps/gateway/.gitlab-ci.yml` as a child pipeline

#### Scenario: Root CI triggers frontend pipeline
- **WHEN** a commit changes files in `apps/frontend/`
- **THEN** the root CI triggers `apps/frontend/.gitlab-ci.yml` as a child pipeline

#### Scenario: Root CI triggers admin pipeline
- **WHEN** a commit changes files in `apps/admin/`
- **THEN** the root CI triggers `apps/admin/.gitlab-ci.yml` as a child pipeline

### Requirement: Shared contracts changes trigger all dependent apps
When `packages/contracts/` changes, all app pipelines that depend on it SHALL be triggered.

#### Scenario: Contracts change triggers all apps
- **WHEN** a commit changes files in `packages/contracts/`
- **THEN** the root CI triggers all 4 app pipelines (backend, gateway, frontend, admin)

### Requirement: Lockfile changes trigger all apps
When `pnpm-lock.yaml` changes, all app pipelines SHALL be triggered since dependency changes can affect any app.

#### Scenario: Lockfile change triggers all apps
- **WHEN** a commit changes `pnpm-lock.yaml`
- **THEN** the root CI triggers all 4 app pipelines

### Requirement: Apps only build when their own files change
Each app pipeline SHALL NOT run when only unrelated apps change.

#### Scenario: Backend-only change does not trigger frontend
- **WHEN** a commit only changes files in `apps/backend/`
- **THEN** the frontend, admin, and gateway pipelines do NOT run

### Requirement: Child pipelines preserve existing environments
Each app's child pipeline SHALL maintain its existing environment stages (dev, stg, prod) as they were before the monorepo migration.

#### Scenario: Gateway preserves staging environment
- **WHEN** the gateway child pipeline runs
- **THEN** it includes build-stg and deploy-stg stages (as gateway has a staging environment)

#### Scenario: Backend has no staging environment
- **WHEN** the backend child pipeline runs
- **THEN** it does NOT include staging stages (backend only has dev and prod)

### Requirement: Child pipelines use rules instead of only/except
Child pipeline jobs SHALL use `rules:` syntax instead of deprecated `only:`/`except:` directives.

#### Scenario: Dev build uses merge request rule
- **WHEN** a merge request is created or updated
- **THEN** dev build and deploy jobs run

#### Scenario: Prod build uses main branch rule
- **WHEN** code is merged to main branch
- **THEN** prod build job is available (manual trigger where applicable)

### Requirement: Dockerfiles use Node.js 22
All Dockerfiles SHALL use `node:22-alpine` as the base image to match the project's Node.js version.

#### Scenario: Backend Dockerfile uses Node 22
- **WHEN** the backend Docker image is built
- **THEN** it uses `node:22-alpine` as the base image
