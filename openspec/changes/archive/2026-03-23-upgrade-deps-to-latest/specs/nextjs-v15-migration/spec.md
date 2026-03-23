## ADDED Requirements

### Requirement: Next.js upgraded to v15
Both frontend and admin apps SHALL use Next.js ^15.x.

#### Scenario: Frontend uses Next.js 15
- **WHEN** inspecting apps/frontend/package.json
- **THEN** the `next` dependency SHALL be ^15.x

#### Scenario: Admin uses Next.js 15
- **WHEN** inspecting apps/admin/package.json
- **THEN** the `next` dependency SHALL be ^15.x

### Requirement: Async request APIs migrated
All usages of `cookies()`, `headers()`, `params`, and `searchParams` SHALL be updated to use the async versions required by Next.js 15.

#### Scenario: Dynamic API calls are awaited
- **WHEN** any page or route handler calls `cookies()` or `headers()`
- **THEN** the call SHALL be awaited (e.g., `const cookieStore = await cookies()`)

#### Scenario: Page params are awaited
- **WHEN** a page component receives `params` or `searchParams` props
- **THEN** the values SHALL be awaited before use (e.g., `const { id } = await params`)

### Requirement: Build succeeds with Next.js 15
Both frontend and admin apps SHALL build successfully with `next build`.

#### Scenario: Frontend builds
- **WHEN** running `pnpm --filter frontend build`
- **THEN** the build SHALL complete without errors

#### Scenario: Admin builds
- **WHEN** running `pnpm --filter admin build`
- **THEN** the build SHALL complete without errors

### Requirement: Caching behavior reviewed
Next.js 15 changes default caching behavior. Fetch requests are no longer cached by default. Any fetch calls relying on default caching SHALL be explicitly configured.

#### Scenario: API calls with caching expectations are explicit
- **WHEN** a fetch call previously relied on Next.js 14 default caching
- **THEN** it SHALL explicitly set `cache: 'force-cache'` or use `unstable_cache`/`next.revalidate`
