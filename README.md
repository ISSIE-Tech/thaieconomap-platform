# ThaiEconoMap

A public map of Thailand's local economy — small shops, community businesses, and
the mobile street vendors who move through a neighbourhood rather than sit in it.

Built by the ISSIE research group at Chulalongkorn
University. The whole server side is self-hostable: no commercial map key, no
vendor account, nothing that can be switched off from somewhere else.

> **Status: newly opened.** Credentials from the private history have been
> rotated, and the housekeeping is still in progress — see
> [Known rough edges](#known-rough-edges) for what is not finished yet. Issues
> and pull requests are welcome from day one.

---

## What is in here

A pnpm + Turborepo monorepo. Six applications and one shared package.

| Path | What it is | Stack | Dev port |
|---|---|---|---|
| `apps/frontend` | The public map. Browse shops and vendors, get directions, register a business. | Next.js 15, React 19, Leaflet on OpenStreetMap | 8000 |
| `apps/admin` | Admin console. Curate businesses, approve registrations, run announcements. | Next.js 15, MUI | 8001 |
| `apps/gateway` | API gateway. The only service a browser talks to: handles login, signs and proxies everything else. | NestJS 11 | 8002 |
| `apps/backend` | The domain service. Businesses, vendors, districts, images, OTP, push. | NestJS 11, Mongoose | 8003 |
| `apps/csc-liff` | CSC job board, served as a LINE mini-app (LIFF). | Next.js 15 | 8004 |
| `apps/csc-backend` | Backend for the CSC job board. | NestJS, Mongoose | 3001 |
| `packages/contracts` | Shared DTOs, enums and models. One definition of "a business", imported by every app above. | TypeScript | — |

The vendor-facing mobile app lives in its own repository, **pumpuang-mobile**
(Flutter), published alongside this one. Vendors sign in with an SMS
OTP — no password — and background location puts their truck on the public map
while they are trading.

### How a request flows

```
browser ──► gateway (8002) ──► backend (8003) ──► MongoDB
             │   signs each call with an HMAC          │
             │   of API_KEY using API_KEY_SECRET       └─► Redis   (response + session cache)
             │                                         └─► MinIO   (business and vendor photos)
             └──────────────► csc-backend (3001) ──► MongoDB
```

Nothing in the browser talks to `backend` or `csc-backend` directly. The gateway
terminates the user's JWT, then re-signs the call to the service behind it — so
the service-to-service key pairs in the two `.env` files have to match. Requests
without an `Authorization` header pass straight through, which is why the map
renders for a visitor who has never logged in.

Map tiles come from the public OpenStreetMap tile servers. Thailand's provinces
and districts are our own data, in our own database — see
[`apps/backend/skeletons/districts-position.json`](apps/backend/skeletons/districts-position.json).

---

## Run it locally

You need **Node.js 20+**, **pnpm 10** (`corepack enable`) and **Docker**.

```bash
git clone <this repo> && cd thaieconomap-monorepo
docker compose up -d
pnpm install
```

`docker compose up -d` starts MongoDB, Redis and MinIO, creates the image
bucket, and seeds Thailand's **77 provinces and 928 districts** so the map has
something to draw. Every credential it uses is a throwaway local default; see
[`.env.example`](.env.example) if you want to change one.

Then give each app you want to run its environment, and start it:

```bash
cp apps/backend/.env.example  apps/backend/.env
cp apps/gateway/.env.example  apps/gateway/.env
cp apps/frontend/.env.example apps/frontend/.env

pnpm --filter thaieconomap-backend  dev   # :8003
pnpm --filter thaieconomap-gateway  dev   # :8002
pnpm --filter thaieconomap-frontend dev   # :8000
```

Open <http://localhost:8000>. You should get the map of Bangkok, with the
province and district filters populated. It will say it found zero businesses —
that is correct, the seed only ships administrative boundaries. Add one through
the app, or point the admin console at it.

The example `.env` files are enough on their own: no Firebase project, no SMS
account and no LINE channel are needed to run the map. Features that depend on
them disable themselves and say so in the log. To log in as a vendor without
sending a real SMS, use the `BYPASS_PUMPUANG_PHONE_NUMBER` / `BYPASS_PUMPUANG_OTP`
pair from `apps/backend/.env.example`.

The admin console and the CSC job board are optional:

```bash
cp apps/admin/.env.example apps/admin/.env  && pnpm --filter thaieconomap-admin dev  # :8001
cp apps/csc-liff/.env.example apps/csc-liff/.env && pnpm --filter csc-liff dev       # :8004
cp apps/csc-backend/.env.example apps/csc-backend/.env && pnpm --filter csc-backend start:dev  # :3001
```

### Useful commands

```bash
pnpm build                 # turbo build, every app
pnpm lint                  # turbo lint
pnpm test                  # turbo test

docker compose down        # stop
docker compose down -v     # stop and delete the databases
docker compose up seed     # re-seed districts (drops and reloads the collection)
```

MinIO's console is at <http://localhost:9001>, with the credentials from
`.env.example`.

### If something does not come up

- **`Config validation error` on a NestJS app.** A variable is missing from your
  `.env`. The message names it; compare against the app's `.env.example`.
- **Gateway returns 401 for everything.** The gateway's
  `THAIECONOMAP_API_KEY`/`THAIECONOMAP_API_SECRET` must equal the backend's
  `API_KEY`/`API_KEY_SECRET`, and the backend's `GATEWAY_API_KEY`/`GATEWAY_API_SECRET`
  must equal the gateway's `API_KEY`/`API_KEY_SECRET`. The defaults in the
  example files already line up.
- **Redis connection refused.** Compose publishes Redis on **6380**, not 6379,
  to stay clear of a Redis you may already run.
- **Map loads but has no provinces.** The seed did not run. `docker compose up seed`
  and watch for `928 document(s) imported successfully`.

---

## Developing

Significant changes start as a written spec in [`openspec/`](openspec/), so the
reasoning survives next to the code and a newcomer can read why, not just what.
Have a look at `openspec/changes/archive/` for examples.

Branching, commit conventions and how to open a merge request are in
[CONTRIBUTING.md](CONTRIBUTING.md).

When you change a shared type, change it in `packages/contracts` — the compiler
will then find every surface that needs updating. That package is the reason a
team this size can keep five front-ends honest.

---

## Known rough edges

We would rather you hear these from us than discover them:

- **The app is Thai-only.** There is no i18n layer at all; strings are inline in
  the components. Nothing about the data model is Thai-specific. This is the
  easiest place to make a first contribution.
- **The map gets slow before the country is fully mapped.** No geo indexing, no
  server-side clustering.
- **There is no public read API and no GeoJSON export**, so the data cannot
  currently leave the system in a form anyone else can use.
- **Deploying your own city still means editing more than one config file.**
  The goal is: change one file, seed your own boundaries, run your own map.
- **There are no production deployment manifests here.** We run this on
  Kubernetes with Flux, but those manifests describe our cluster — our
  hostnames, our registry, our secret store — so they are not published. What is
  published is the Docker Compose stack above, which is what you want for local
  work anyway. If you are trying to run ThaiEconoMap for your own city, open an
  issue: we would rather write a generic deployment example together than hand
  you a sanitised copy of ours.
- **The test and CI story is thin**, and the vendor tracking service is not yet
  decoupled.
- **`pnpm build` at the root currently fails on `csc-liff`** — two copies of
  `@types/leaflet` resolve in the same file. Every other app builds clean, and
  the map is unaffected. Build the app you are working on
  (`pnpm --filter thaieconomap-frontend build`) until this is fixed.
- **We lean on public OpenStreetMap tile servers**, which are a commons we are
  consuming rather than contributing to.

---

## Licence

The code in this repository is **MIT** — see [LICENSE](LICENSE). Run it, fork
it, build on it, commercially or otherwise. We would like improvements back, but
the licence does not require it of you.

The **map data is not ours to relicense.** Tiles and base geography come from
OpenStreetMap under the
[Open Database License](https://www.openstreetmap.org/copyright): if you take
the business data out of this system and publish it, ODbL's attribution and
share-alike terms are what govern that, not the MIT licence on the code.

## Credits

ThaiEconoMap is a project of the ISSIE research group, Chulalongkorn University.
Map data © OpenStreetMap contributors, available under the
[Open Database License](https://www.openstreetmap.org/copyright).
