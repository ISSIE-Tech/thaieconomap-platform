## Context

The admin dashboard (`apps/admin`) manages pumpuang (tuk-tuk) records through a list view with approve/reject/delete actions. The backend already exposes full CRUD endpoints (`POST /pumpuangs`, `PUT /pumpuangs/:id`, `DELETE /pumpuangs/:id`) and tracking route history (`GET /pumpuangs/:id/route`), but the admin frontend only consumes the list and status-change endpoints. Admins currently cannot create, edit, or view tracking history through the dashboard.

The existing admin codebase follows consistent patterns: service layer with axios, React Query hooks, MUI components, React Hook Form + Zod for forms. The commercial module already has full CRUD with create/edit forms that serve as a reference implementation.

## Goals / Non-Goals

**Goals:**
- Admin can create new pumpuang records directly (bypassing the pending submission flow)
- Admin can edit any pumpuang field (name, license plate, owner, color, phone, opening hours, types, images)
- Admin can view detailed tracking history per pumpuang with route visualization on a map
- Admin can manage (view/delete) closed tracking sessions
- Follow existing patterns from the commercial module for consistency

**Non-Goals:**
- Real-time live tracking view in admin (this is a mobile app concern)
- Backend API changes — all needed endpoints already exist
- Modifying the pending submission workflow (approve/reject stays as-is)
- Analytics or reporting on tracking data
- Editing tracking history data

## Decisions

### 1. Follow commercial module CRUD pattern
**Decision**: Mirror the commercial module's create/edit form structure (`new/page.tsx`, `edit/[id]/page.tsx`) with shared form component.

**Rationale**: The commercial module already has battle-tested create/edit forms with image upload, opening hours management, and type selection — the exact same fields pumpuang needs. This ensures consistency and reduces implementation risk.

**Alternative considered**: Building a custom inline-edit in the list drawer — rejected because it would diverge from established patterns and be harder to maintain.

### 2. Shared form component for create and edit
**Decision**: Create a single `PumpuangForm` component used by both `/new` and `/edit/[id]` pages, with a `mode` prop (`create` | `edit`).

**Rationale**: Pumpuang create and edit share identical fields. A shared form with Zod schema validation prevents field drift between the two views.

### 3. Tracking history as a sub-route of pumpuang detail
**Decision**: Add tracking history at `/dashboard/economap/pumpuang/[id]/tracking` as a dedicated page.

**Rationale**: Tracking history is data-heavy (map + route list) and benefits from a full page. Keeping it under the pumpuang ID route makes navigation intuitive.

### 4. Map visualization with React Leaflet
**Decision**: Use React Leaflet (already installed) for route visualization, rendering polylines from the tracking history location data.

**Rationale**: Leaflet is already a project dependency used elsewhere. No need for additional mapping libraries.

### 5. Reuse existing backend endpoints
**Decision**: Wire admin to existing endpoints without backend changes.

**Endpoints to consume:**
- `POST /services/thai-economap/pumpuangs` — create
- `PUT /services/thai-economap/pumpuangs/:id` — update
- `GET /services/thai-economap/pumpuangs/:id` — get single
- `GET /services/thai-economap/pumpuangs/:id/route` — tracking history
- `POST /services/thai-economap/pumpuangs/upload-additional-image` — image upload
- `DELETE /services/thai-economap/pumpuangs/:id/delete-additional-image` — image delete

## Risks / Trade-offs

- **[Large form complexity]** Opening hours management with day/time slots is complex UI. **Mitigation**: Reference the commercial module's opening hours component and reuse/adapt it.
- **[Tracking data volume]** Old pumpuangs may have extensive tracking history. **Mitigation**: The route endpoint already handles this; paginate or limit display in the UI if needed.
- **[Image upload flow]** Image uploads use a separate endpoint that returns URLs. **Mitigation**: Follow the same upload pattern used in commercial and pending pumpuang forms.
