## Context

The monorepo has 4 apps (backend, gateway, frontend, admin) and 1 shared package (contracts). Each app has its own `.gitlab-ci.yml` and `Dockerfile` from when they were separate repos. The current CIs use `only: merge_requests` / `only: main` which triggers all pipelines on any change. Dockerfiles already build from monorepo root context correctly.

Current structure:
- `apps/backend/.gitlab-ci.yml` — stages: build-dev, deploy-dev, build-prod, deploy-prod
- `apps/gateway/.gitlab-ci.yml` — stages: build-dev, deploy-dev, build-stg, deploy-stg, build-prod, deploy-prod
- `apps/frontend/.gitlab-ci.yml` — stages: build-dev, deploy-dev, build-stg, deploy-stg, build-prod, deploy-prod
- `apps/admin/.gitlab-ci.yml` — stages: build-dev, deploy-dev, build-prod, deploy-prod
- All use BuildKit for image builds, push to `registry.issie.dev`, and deploy via GitOps (updating k8s manifests in a separate repo)

## Goals / Non-Goals

**Goals:**
- Root `.gitlab-ci.yml` triggers child pipelines only when relevant files change
- Each app pipeline runs when `apps/<name>/**` or `packages/contracts/**` changes
- Preserve existing build/deploy behavior (BuildKit, registry, GitOps flow)
- Update Dockerfiles to `node:22-alpine` to match upgraded Node.js

**Non-Goals:**
- Changing the deployment strategy (GitOps pattern stays)
- Adding new environments (keep existing dev/stg/prod per app)
- Modifying the k8s deployment repo
- Adding tests or lint stages to CI (future work)

## Decisions

### 1. Use `trigger` with `include:local` for child pipelines

The root CI will use GitLab's `trigger: include: local` to reference each app's `.gitlab-ci.yml` as a child pipeline. This keeps each app's CI self-contained and editable independently.

Alternative: Single flat `.gitlab-ci.yml` with all jobs — rejected because it would be harder to maintain and wouldn't scale.

### 2. Use `rules: changes` for path-based triggering

```yaml
rules:
  - changes:
      - apps/backend/**
      - packages/contracts/**
```

Each trigger job uses `rules: changes` to detect which apps are affected. The `packages/contracts/**` path is included for all apps since they all depend on the shared contracts package.

Alternative: Use `only: changes` — rejected because `rules` is the modern GitLab CI syntax and `only/except` is deprecated.

### 3. Remove `only:` from child pipelines

Child pipelines inherit the trigger context from the parent. The `only: merge_requests` / `only: main` conditions move to the root CI's trigger rules. The child `.gitlab-ci.yml` files keep their stages and jobs but remove `only:` directives.

### 4. Update Node.js base image to 22-alpine

Dockerfiles currently use `node:20-alpine`. Since the project upgraded to Node.js 22+, the Dockerfiles should match.

## Risks / Trade-offs

- **Child pipeline context paths** — Child pipelines triggered via `include:local` run with the repo root as context. The existing Dockerfiles already use monorepo-root-relative paths (`COPY apps/backend/...`), so this works. → Verify by testing a pipeline run.
- **Concurrent GitOps pushes** — Multiple apps deploying simultaneously could cause git push conflicts in the k8s deployment repo. → This is a pre-existing issue, not introduced by this change.
- **`pnpm-lock.yaml` changes** — Changes to the lockfile at root affect all apps but won't trigger any specific app pipeline. → Add `pnpm-lock.yaml` to the changes list for all apps.
