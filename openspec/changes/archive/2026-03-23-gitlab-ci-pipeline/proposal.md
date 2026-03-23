## Why

The project was migrated from separate repos to a monorepo, but each app still has its own `.gitlab-ci.yml` designed for standalone repos. These child CIs use `only: merge_requests` / `only: main` which won't work correctly in a monorepo — every MR triggers all 4 app pipelines regardless of what changed. A root-level `.gitlab-ci.yml` is needed to orchestrate child pipelines with path-based change detection, so each app only builds/deploys when its own code (or the shared `packages/contracts`) changes.

## What Changes

- Create a root `.gitlab-ci.yml` that triggers child pipelines per app using `include` with `changes` rules
- Each app pipeline triggers only when files in `apps/<name>/` or `packages/contracts/` change
- Update each app's `.gitlab-ci.yml` to work as child pipelines (remove `only:` triggers, use `rules:` from parent)
- Update Dockerfiles to use `node:22-alpine` (matching the upgraded Node.js version)
- Ensure all Dockerfiles correctly build from monorepo root context with shared `packages/contracts`

## Capabilities

### New Capabilities
- `monorepo-ci`: Root GitLab CI configuration that orchestrates child pipelines per app with path-based change detection

### Modified Capabilities

## Impact

- Root `.gitlab-ci.yml` (new file)
- `apps/backend/.gitlab-ci.yml` — converted to child pipeline
- `apps/gateway/.gitlab-ci.yml` — converted to child pipeline
- `apps/frontend/.gitlab-ci.yml` — converted to child pipeline
- `apps/admin/.gitlab-ci.yml` — converted to child pipeline
- All 4 Dockerfiles — Node.js base image update
- CI/CD behavior: pipelines now only run for affected apps
