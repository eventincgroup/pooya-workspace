# Constitution

Shared rules for every pipeline agent. Read this file at the start of a run. Agent files add only a Goal, Input, Output, and invariants — they do not repeat this speech.

## Principles

- **Ask product questions; never guess.** A fork in user-visible behaviour is for the human. A fact the repo can answer is not — send `investigate` back, do not ask.
- **Follow every rule in `.opencode/design-rules.md`.** Every stage, every agent. Add new design constraints there; do not copy them into agent files or the yaml graphs.
- **Spec before plan** (project only). *What* the system does is settled before *how* or *where* it is built. Incidents have no Spec; the confirmed plan comment is the plan.
- **Scope is what you hand over.** Do not give `build` or `gate` a document that describes neighbouring work.
- **Linear is state.** Sessions are disposable. Resume from docs and issues, not from memory. For **incident**, state is this issue and its comments — no project documents.
- **`project` walks `.opencode/pipeline.yaml`. `incident` walks `.opencode/incident.yaml`.** Neither invents hops. Change a project stage in `pipeline.yaml`; change an incident stage in `incident.yaml`.
- **Split write power.** `build` writes code. Only `repo-ops` touches git. Orchestrators do neither.
- **A different model family gates the work.** `compose` is A-gen; `gate` is A-gate. Do not treat a clean code gate as free if those models ever share a family again.
- **A decision is not made until it is written down.** Project: patch Spec, Plan, and Technical Design before the stage continues; record `sync: pending` on the issue first. Incident: comment findings, confirmation, and any extra user context on the issue (`issue-comment` subgraph).
- **Vertical slices.** Issues are user-visible value, not layers or repos. A flow that needs both repos is one issue.
- **Reference, never duplicate.** Project issues point at named Spec/Plan sections. They do not copy criteria or steps. Incidents point at confirmed comments on the same issue.
- **Patch posted docs; do not rewrite them.** Exception: first authoring of the Technical Design may replace the whole document, but must carry forward every `sync: done` decision. Incidents do not patch project docs.

## Status line

Every subagent report opens with exactly one of:

- `status: COMPLETE` — finished the work described in its Goal.
- `status: INCOMPLETE — <what it did not get to>` — ran out of steps first.

`COMPLETE` is a claim, never a default. A missing status line is INCOMPLETE.

The orchestrator treats INCOMPLETE (or a missing line) as a **failed run, never a partial result**. Re-invoke once with a narrower scope. If it fails again, stop and let the user split the work. Never post a doc or land a PR on a report that did not finish.

## Loop cap

Every cascade, repair, and re-verify loop runs **at most 3 rounds**. A loop that has not converged in three rounds is a scoping problem. Stop and hand the user what is still standing. Report how many rounds each loop took.

## Open questions

Each open question is tagged:

- `kind: product` — a fork in behaviour, ownership, or what to ship. Orchestrator **asks the user**.
- `kind: code` — something the repo or docs can settle. Orchestrator **re-invokes `investigate`**. Do not ask the user.

## Orchestrator rules

- Product question → ask the user, wait for a real answer, then continue.
- Code question → re-invoke `investigate` (or the matching read-only role), do not ask.
- Incomplete → run the `incomplete-retry` subgraph in the yaml this primary walks (`pipeline.yaml` or `incident.yaml`).
- Complete and no product questions → continue to the next matching stage in that yaml. Incident still stops for every `stop_for`. Confirm is required through **plan**; after a green apply it opens the PR without waiting.
- A decision on **project** runs the **doc-sync** subgraph in `.opencode/pipeline.yaml` before the stage continues.
- A decision on **incident** (user ruling, extra context, accepted findings) runs the **issue-comment** subgraph in `.opencode/incident.yaml` before the stage continues.
- A mechanical auto-fix (lint, missing mandated test, a value the criterion states outright) is not a decision. If the fix was only needed because a document or issue comment was wrong, that wrongness *is* a decision.
- Never move an issue to Done. Done means merged.
- Never force-push. Never skip hooks. Never commit on `main`/`master`.
- **Project:** backlog issues are never picked up. Only Todo-equivalent (`unstarted`) issues. No whole-project implementation. No issues → tell the user to run `slice`.
- **Incident:** pick the issue the user named or linked, even if it is not Todo. Do not pick a different issue.

## Document remit

Project only:

- **Spec** — user-visible behaviour, flows, EARS criteria. Never name a repo, module, library, or technology.
- **Plan** — what changes where, per repo: contracts, data shapes, ownership, sequencing.
- **Technical Design** — architecture, domains/areas, schema, interfaces, risks, testing plan, deployment.
- **WWW / Pitch / Solution Brief** — human-authored intake. Never patch them. If a decision contradicts the Solution Brief, ask.

Solution Brief wins over WWW/Pitch on conflict.

Incidents have no project documents. The confirmed plan comment on the issue is the plan.
