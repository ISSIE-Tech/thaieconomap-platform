## Context

The ThaiEconomap monorepo contains 4 apps (backend, gateway, frontend, admin) and 1 shared package (contracts). The backend and gateway run NestJS (v10 and mixed v10/v11 respectively), while frontend and admin run Next.js 14 with React 18 and MUI v5. ESLint v8 is used across all apps with legacy config format.

The gateway already has a partially started NestJS v11 upgrade (@nestjs/common and @nestjs/core are v11, but platform-express and testing are still v10), creating an inconsistent state that needs resolution.

## Goals / Non-Goals

**Goals:**
- Upgrade all major frameworks to their latest stable versions
- Unify dependency versions across all apps (eliminate version drift)
- Maintain all existing functionality — zero behavior changes
- Keep the upgrade incremental and testable at each phase

**Non-Goals:**
- Adopting React Server Components or App Router migration (stay on current routing patterns)
- Rewriting application architecture to leverage new framework features
- Upgrading Node.js beyond v20 (current Dockerfiles use node:20-alpine, which remains supported)
- Migrating away from any current libraries (e.g., replacing MUI, switching from Mongoose to Prisma)

## Decisions

### 1. Phased upgrade order: Backend → Frontend → Tooling

**Rationale:** Backend apps (NestJS) have fewer UI-related peer dependency chains, making them safer to upgrade first. Frontend upgrades (React 19 → Next.js 15 → MUI 6) have tight interdependencies and should be done together per app. ESLint/tooling comes last since it doesn't affect runtime.

**Alternatives considered:**
- All-at-once: Too risky, hard to bisect failures
- Per-app isolation: Possible but creates long-lived version drift within the monorepo

### 2. Upgrade React 19 before Next.js 15

**Rationale:** Next.js 15 requires React 19. Upgrading React first allows testing component compatibility in isolation before adding Next.js routing/rendering changes.

### 3. MUI v5 → v6 alongside React 19

**Rationale:** MUI v6 supports React 19. Upgrading MUI to v6 while on React 18 would add an unnecessary intermediate state. Bundle both to minimize churn.

### 4. ESLint flat config migration as a separate phase

**Rationale:** ESLint v9 drops support for `.eslintrc` format. This is a config-only change with no runtime impact, so it can be done independently after all framework upgrades are stable.

### 5. Fix gateway's mixed NestJS version first

**Rationale:** The gateway currently mixes v10 and v11 packages. Before upgrading backend to v11, resolve gateway to a consistent v11 state first, since it's already partially there.

## Risks / Trade-offs

- **React 19 breaking changes in refs and context** → Mitigation: Audit all `forwardRef` usage and context consumers before upgrading. React 19 makes ref a regular prop.
- **Next.js 15 async request APIs** → Mitigation: `cookies()`, `headers()`, `params`, `searchParams` become async in Next.js 15. Search for all usages and update.
- **MUI v6 theme/styling changes** → Mitigation: Run MUI codemods, then manually review theme customizations.
- **NestJS v11 module resolution changes** → Mitigation: Test each module individually; NestJS v11 is largely backward compatible with v10.
- **OpenTelemetry package version alignment** → Mitigation: Use OTel's compatibility matrix to pick versions that work together.
- **Peer dependency conflicts during transition** → Mitigation: Use `pnpm` overrides in root package.json to force consistent versions where needed, remove after upgrade completes.

## Migration Plan

1. Create a feature branch for the entire upgrade
2. Phase 1: Gateway NestJS v11 unification → Backend NestJS v10 → v11
3. Phase 2: React 18 → 19, Next.js 14 → 15, MUI v5 → v6 (frontend first, then admin)
4. Phase 3: ESLint v8 → v9 flat config, @typescript-eslint v8
5. Phase 4: Remaining dependency bumps (minor/patch versions)
6. Run full test suite after each phase
7. Rollback: Each phase is a separate commit; revert to last known-good commit if needed

## Open Questions

- Should we also bump pnpm from 9.15 to latest 9.x or jump to 10.x?
- Are there any pinned dependency versions due to known bugs that should remain pinned?
