# Architecture Overview

*How does this feature fit into the existing system? What components are involved, created, or modified?*

<Paste a diagram, link to an Figma board, or describe in prose.>

Fill the sections that apply. A feature may touch nexus, eventinc, or both — do not force eventinc work into nexus domain/module headings, and do not omit nexus structure when the work lives there.

## Repos Affected

* Which of eventinc / nexus (or both), and why — derived from the Routes list below, not from a guess.

## Routes

*Every user-facing UI and every API this feature uses. Exact full URL, from the user, never invented. `localhost:3232` = eventinc (legacy). `localhost:4000` = nexus.*

| Kind | Full URL | Repo |
|---|---|---|
| UI | http://localhost:4000/… | nexus |
| API | http://localhost:3232/… | eventinc |

## Cross-repo Integration

*Required whenever both repos are relevant — including when the answer is "the existing surface already covers it."*

Already built, check first: nexus `Nexus.ESB.Legacy` (`lib/nexus/esb/legacy/`) mirrors eventinc models for nexus-side reads; eventinc `app/controllers/nexus/` exposes `/nexus/*` (`authenticate`, `signed_url`, `navigate`) for session/navigation handoff.

* How the two connect for this feature, or why a new mechanism is genuinely needed.

## Domains Affected (nexus)

*When this feature changes nexus bounded contexts.*

* <e.g. Nexus.Negotiation>
  * Changes…

## Modules Affected (nexus)

* **Generic Components:**
  * <e.g. Dialog>
    * **Change:** New / Modified / Deleted
    * **Notes:** <...>
* **Building Blocks**
  * <...>
    * Change: <...>
    * Notes: <...>
* **Domain Context Modules**
  * <...>
    * Change: <...>
    * Notes: <...>

## Areas Affected (eventinc)

*When this feature changes the Rails API and/or the Next.js app.*

* **Rails:** controllers, models, services, jobs — path + change (new / modified / deleted)
* **Next.js (`nextjs/`):** pages, components, API routes — path + change
* **Contracts:** serializers, JSON shapes, Salesforce or other side effects

# Data Layer

## **Schema Changes**

*New tables, modified columns, index additions, or migrations required.*

```text
Table: orders (new)
  - id:          uuid, primary key
  - user_id:     uuid, FK → users.id
  - status:      enum [pending, paid, failed]
  - inserted_at: timestamp

Table: users (modified)
  - + last_order_at: timestamp, nullable
```

## **Migration Strategy**

* <e.g. Zero-downtime migration, backfill job required, feature-flagged rollout>

## **Performance / Scalability Notes**

* <e.g. Index on (user_id, inserted_at) for timeline queries>
* <e.g. Expected row volume, query patterns, caching strategy>

# System Interfaces

**Internal API Endpoints for other internal systems (e.g. Legacy)**

* **GET** /legacy/api/...
  * <description>
  * Auth: <...>
* **POST** /legacy/api/...
  * <description>
  * Auth: <...>

## **Request / Response Examples**

*Include only for non-obvious contracts.*

```text
// POST /legacy/api/X
// Request
{ "user_id": "uuid", "items": [...] }

// Response 201
{ "id": "uuid", "status": "pending" }
```

## **Integrations**

* **Service:** <e.g. Legacy>
  * **Purpose:** <e.g. Sync offers>
  * <Notes>

# Technical Risks & Constraints

*Engineering-specific concerns not already covered in the Pitch's Risks & Rabbit Holes. Focus on feasibility and system-level concerns.*

* **Risk:** <e.g. N+1 queries on order list>
  * **Likelihood:** Medium
  * **Impact:** High
  * **Solution** <e.g. Preload associations, add query analysis to review checklist>

# Testing Plan

Design-level test risks and the kinds of tests this change needs. Do **not** restate Spec acceptance criteria here — those do not exist until the Spec is posted. Once a Spec exists, link it and add any extra design-level cases the Spec does not cover.

## Coverage Strategy

* **Unit:** <scope — nexus: context logic, changesets; eventinc: models, services>
* **Integration:** <scope — nexus: API + DB; eventinc: request specs>
* **End-to-end:** <scope — critical user flows in LiveView and/or Next.js>

## Critical Test Cases

1. **Happy path:** <scenario> → <expected result>
2. **Failure / error state:** <scenario> → <expected result> *(edge case)*
3. <design-level risks only — not a copy of Spec EARS criteria>

# Deployment Plan

## **Infrastructure Changes**

* **New services?** <Yes / No — describe if yes>
* **Environment variables / secrets to add:** <list names only, never values>

## **Rollback Strategy**

* <e.g. Toggle feature flag off / revert merge + redeploy / reverse migration script ready>

## **Post-Deployment**

* **Monitoring:** <e.g. Sentry dashboard>
  * **Follow-up / cleanup tickets:** <link to any known tech debt created>