# **🏛️ Architecture Overview**

*How does this feature fit into the existing system? What components are involved, created, or modified?*

<Paste a diagram, link to an Figma board, or describe in prose.>

## Domains Affected

* <e.g. Nexus.Negotiation>
  * Changes…

## **Modules Affected**

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

# 📦 **Data Layer**

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

# **🎎 System Interfaces**

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

# **🙀 Technical Risks & Constraints**

*Engineering-specific concerns not already covered in the Pitch's Risks & Rabbit Holes. Focus on feasibility and system-level concerns.*

* **Risk:** <e.g. N+1 queries on order list>
  * **Likelihood:** Medium
  * **Impact:** High
  * **Solution** <e.g. Preload associations, add query analysis to review checklist>

# **🧪 Testing Plan**

## **Coverage Strategy**

* **Unit:** <scope, e.g. context logic, changesets>
* **Integration:** <scope, e.g. API endpoints + DB>
* **End-to-end:** <scope, e.g. critical user flows>

## **Critical Test Cases**

*This must include at least all items in acceptance criteria:*

1. **Happy path:** <scenario> → <expected result>
2. **Failure / error state:** <scenario> → <expected result> *(edge case)*
3. <...>

# **🚀 Deployment Plan**

## **Infrastructure Changes**

* **New services?** <Yes / No — describe if yes>
* **Environment variables / secrets to add:** <list names only, never values>

## **Rollback Strategy**

* <e.g. Toggle feature flag off / revert merge + redeploy / reverse migration script ready>

## **Post-Deployment**

* **Monitoring:** <e.g. Sentry dashboard>
  * **Follow-up / cleanup tickets:** <link to any known tech debt created>