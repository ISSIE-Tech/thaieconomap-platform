# Contributing to ThaiEconoMap

Thank you for wanting to work on this. ThaiEconoMap is maintained by a small
research team, which means two things: your contribution matters more than it
would on a large project, and we may take a few days to answer. Both are true.

**New here?** Start with [README.md](README.md) and get the map running
locally — it takes one `docker compose up -d` and three `pnpm` commands. Then
look for an issue labelled `good first issue`. If you want a gentle entry point,
the app is Thai-only today and we would love help changing that.

Contributions in Thai or English are equally welcome, in issues, merge requests
and code comments alike.

---

## Before you write code

**For a bug fix or a small change**, just open a merge request. No ceremony.

**For anything that changes behaviour, a data model, or an API**, open an issue
first and let's agree on the shape before you spend an evening on it. This is
not bureaucracy — it is us trying not to waste your time with a "we were about
to do that differently" two weeks later.

**For a significant change**, we write a short spec before the code, in
[`openspec/`](openspec/). Read a few in `openspec/changes/archive/` to see the
format. The point is that a newcomer in a year can read why a thing is the way
it is, not just the diff that made it so. A maintainer will help you with this —
don't let it block you from starting.

---

## Branches

| Branch | Purpose | Lifetime |
|--------|---------|----------|
| `main` | Source of truth. Always deployable. | Permanent |
| `feature/*` | New features, refactors | Days to ~2 weeks |
| `fix/*` | Bug fixes | 1–3 days |
| `hotfix/*` | Critical production fixes | 1–3 days |

There is no `dev` or `develop` branch. Everything merges into `main` through a
merge request.

```bash
git checkout main && git pull
git checkout -b feature/short-description

# work, commit, push
git push -u origin feature/short-description
```

Then open a merge request against `main`, from the web UI or with
`glab mr create --target-branch main --title "feat: short description"`.

Wait for CI to go green, self-review your own diff first — it catches more than
you would think — and a maintainer will review from there. `feature/*` and
`fix/*` branches are merged **squashed**, with the source branch deleted.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`,
`chore:`, `refactor:`, `docs:`, `test:`. The subject line is what ends up in the
squashed history, so make it a sentence a stranger can read:

```
feat: add Lao and English translations to the map header
fix: stop the vendor marker drifting when GPS accuracy is poor
```

Write the commit body in whichever language you think in. The subject line in
English keeps the log scannable for everyone.

---

## What we look for in review

- **It does one thing.** A 200-line merge request that fixes a bug *and* tidies
  an unrelated file takes three times as long to review as two merge requests.
- **Shared types live in `packages/contracts`.** If a change means something
  different on the map and in the admin console, it belongs there, once, and the
  compiler finds the rest.
- **No new hardcoded hostnames, keys or bucket names.** Anything
  deployment-specific is an environment variable with a sensible local default,
  and it goes in that app's `.env.example` with a comment saying what it is for.
- **Nothing that only works on our infrastructure.** Someone should be able to
  run this for their own city.
- **Thai text is data, not layout.** Please don't assume string lengths.
- **Be careful around a vendor's location.** It is both their livelihood and
  their safety. Anything that widens who can see where someone is, or for how
  long, is a decision for discussion in an issue, not a detail of an
  implementation.

Run these before you push:

```bash
pnpm lint
pnpm build
pnpm test
```

---

## Project layout

```
apps/frontend       the public map                   (Next.js, :8000)
apps/admin          admin console                    (Next.js, :8001)
apps/gateway        API gateway, auth and proxy      (NestJS,  :8002)
apps/backend        domain service                   (NestJS,  :8003)
apps/csc-liff       CSC job board, LINE mini-app     (Next.js, :8004)
apps/csc-backend    CSC job board backend            (NestJS,  :3001)
packages/contracts  shared DTOs, enums, models
openspec/           specs for significant changes
```

The Flutter app for mobile vendors is a separate repository, **pumpuang-mobile**,
with its own CONTRIBUTING.

---

## Reporting a bug

Open an issue with: what you did, what you expected, what happened, and which
app and browser or device. A screenshot of a wrong map beats three paragraphs
describing it.

**Please do not open a public issue for a security problem.** Mail the
maintainers instead and give us a chance to fix it first.

If the bug involves a real person's data — a vendor's phone number, a location
trace, anything identifying — describe it without pasting the data.

## Translating

The app has no i18n layer yet, so the first translation contribution is partly
plumbing. Say so in an issue before you start and a maintainer will agree the
approach with you, so that two people don't build two different ones. After
that, adding a language should be adding a file.

## Licence of your contribution

This project is MIT-licensed ([LICENSE](LICENSE)). By opening a pull request you
agree that your contribution is released under the same terms. There is no CLA
to sign and no copyright assignment — the work stays yours.

Note that MIT is permissive: anyone, including a commercial operator, may take
this code and run it without contributing anything back. That is a deliberate
choice by the maintainers, not an oversight. If it matters to you, say so in an
issue — the licence can be revisited while the contributor base is still small,
and it is much harder to change later.

---

## Code of conduct

Be decent. Assume the person on the other side is doing their best with less
context than you have. We will not accept harassment of anyone for any reason,
and maintainers will remove comments, commits and contributors that fall short
of that.

This map exists because small businesses and street vendors trusted us with
their information. Everyone working on it inherits that.
