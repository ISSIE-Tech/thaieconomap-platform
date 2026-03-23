## 1. Root CI Configuration

- [x] 1.1 Create root `.gitlab-ci.yml` with trigger jobs for each app (backend, gateway, frontend, admin)
- [x] 1.2 Add `rules: changes` for each trigger job with paths: `apps/<name>/**`, `packages/contracts/**`, `pnpm-lock.yaml`
- [x] 1.3 Configure separate trigger rules for merge requests (dev) and main branch (prod/stg)

## 2. Update Child Pipelines

- [x] 2.1 Update `apps/backend/.gitlab-ci.yml` — remove `only:` directives, add `rules:` with `$CI_PIPELINE_SOURCE == "parent_pipeline"` or appropriate rules
- [x] 2.2 Update `apps/gateway/.gitlab-ci.yml` — same changes, preserve stg stages
- [x] 2.3 Update `apps/frontend/.gitlab-ci.yml` — same changes, preserve stg stages
- [x] 2.4 Update `apps/admin/.gitlab-ci.yml` — same changes (no stg stages)

## 3. Update Dockerfiles

- [x] 3.1 Update `apps/backend/Dockerfile` — change `node:20-alpine` to `node:22-alpine`
- [x] 3.2 Update `apps/gateway/Dockerfile` — change `node:20-alpine` to `node:22-alpine`
- [x] 3.3 Update `apps/frontend/Dockerfile` — change `node:20-alpine` to `node:22-alpine`
- [x] 3.4 Update `apps/admin/Dockerfile` — change `node:20-alpine` to `node:22-alpine`

## 4. Verification

- [x] 4.1 Validate root `.gitlab-ci.yml` syntax (gitlab-ci-lint or manual review)
- [x] 4.2 Validate all child pipeline YAML syntax
- [x] 4.3 Verify Dockerfiles build correctly with `node:22-alpine`
