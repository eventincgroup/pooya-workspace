# Pipeline

Declared stages. The `project` primary reads Linear, matches a row, runs it, and continues when the gate is green. Read `.opencode/constitution.md` and `.opencode/repos.md` with this file.

Match **from the bottom of the "When" list that applies** — `refine` beats greenfield when docs already exist and the user is stating a change.

---

## design

- **When:** no `Technical Design: <project>` document yet (or the user asked to revisit it).
- **Needs:** WWW, Pitch, Solution Brief. Solution Brief is authoritative.
- **Run:**
  1. `investigate` mode `before-spec` — one per configured repo, in parallel.
  2. Ask every `kind: product` question. Re-invoke `investigate` for `kind: code`.
  3. `compose` mode `td` with the template at `.opencode/templates/technical-design-template.md` (read fresh).
  4. Review the draft with the user.
  5. `gate` mode `design` — one per affected repo, in parallel.
  6. Surface concerns as decisions. Loop compose → gate at most 3 rounds.
- **Produces:** Linear document `Technical Design: <project>`. First authoring may replace the whole document; carry forward every `sync: done` decision.
- **Stop for:** product questions; verifier concerns; named tradeoffs the user accepts (write those into Risks).

---

## spec

- **When:** Technical Design exists, no `Spec: <project>` yet.
- **Needs:** WWW, Pitch, Solution Brief. Do **not** pass Technical Design into compose — spec is repo-agnostic.
- **Run:** `compose` mode `spec`. Ask product questions until zero. Post when resolved.
- **Produces:** Linear document `Spec: <project>`.
- **Stop for:** product questions.

---

## plan

- **When:** Spec exists, no `Plan: <project>` yet.
- **Needs:** Spec + Technical Design.
- **Run:**
  1. `investigate` mode `after-spec` — one per configured repo, in parallel.
  2. Product questions → ask, then doc-sync if the answer changes Spec or Technical Design.
  3. `compose` mode `plan` with relevant investigation reports.
  4. Product questions → same treatment. Post when resolved.
- **Produces:** Linear document `Plan: <project>`.
- **Stop for:** product questions; doc-sync concerns.

---

## slice

- **When:** Spec + Plan exist, no issues reference them yet, **and** the user gave a real yes to "break into issues now?"
- **Needs:** full Spec + full Plan.
- **Run:** `slice` once over the whole picture (not per repo). Create Linear issues: scope + named references only; dependency links from the slice order.
- **Produces:** dependency-ordered issues.
- **Stop for:** the approval yes (never infer it from docs existing); under-specified plan sections (sync into the Plan first); a refinement that is clearly a new feature (ask before re-slicing).

If issues exist and `sync: done` comments show the Plan has moved since they were cut: report the drift, ask, then re-run `slice` only for what changed.

---

## build-issue

- **When:** issues exist and at least one is Todo-equivalent (`unstarted`). Never pick backlog. Never implement the whole Plan because there are no issues — tell the user to run `slice`.
- **Needs:** that issue's Scope + the named Spec/Plan/TD **sections** only (not the whole Plan, not the whole Technical Design).
- **Run:**
  1. Finish any leftover `sync: pending` first.
  2. `scope-resolver` on those excerpts. Product questions → ask → doc-sync → re-resolve.
  3. For each repo leg, in order (never parallel): invoke `build` with the scope contract below, then `gate` mode `code` on that leg.
  4. If the handoff contract `build` actually built differs from the Plan: ask, doc-sync, then continue.
  5. Final `gate` mode `code` per affected repo, in parallel. Mechanical concerns → scoped `build` re-invocation. Everything else, and every over-implementation finding → ask → doc-sync → repair. At most 3 rounds.
  6. No `sync: pending` left. Then `repo-ops` one action per call: branch, stage, commit, push, PR. Use `.opencode/repos.md` conventions.
- **Produces:** PR per affected repo; issue in in-review (never Done).
- **Stop for:** product questions; over-implementation; no Todo issue (ask — do not promote from backlog); plan gaps that need `slice`.

### Scope contract for `build`

`build` is the built-in agent. Every invocation must state:

- Checklist steps for **this leg only**, the spec excerpt, the repo path.
- This repo's format and test commands from `.opencode/repos.md`; run format, then tests, report actual output.
- Ownership test, verbatim: *"Before touching any file, ask: is this change entailed by a checklist step or the issue's scope? If the honest answer is 'not directly, but it's related or convenient,' it's out of scope — leave it alone and report it as an observation instead."*
- Observations are reported, never fixed.
- Do **not** stage, commit, push, switch branches, or open a PR — `repo-ops` lands the work.
- If the leg cannot be completed inside the given scope, stop and report that rather than widening scope.
- Report: files changed mapped to checklist steps, steps completed vs not, commands and results, the handoff contract actually built, observations.

---

## refine

- **When:** Spec + Plan + Technical Design already exist, **and** the user states a requirement or a broken behaviour (UX, "it doesn't work") — not "start this project."
- **Needs:** those three documents + the user's requirement.
- **Run:**
  1. Load Spec, Plan, and Technical Design. Match the requirement to them.
  2. Docs already say it, code doesn't → justified no-change on docs, then implement the delta.
  3. Docs are silent → `compose` mode `patch` + `gate` mode `patch` (cascade like doc-sync), then implement.
  4. Docs contradict the user → the user's new word is the decision unless it fights the Solution Brief; if it fights the Brief, ask. Then patch, then implement.
  5. Implement **only this delta**: `scope-resolver` on the patched sections + the requirement (never the whole Plan) → `build` → `gate` mode `code` → `repo-ops`.
- **Produces:** patched docs (or a recorded no-change) + a PR for the delta. Comment the decision on a follow-up issue or the issue still in review.
- **Stop for:** product questions; a change that is clearly a new feature / whole new flow (ask whether to run `slice` instead of a delta build); over-implementation of neighbouring plan work.

Do not re-slice the whole project for a small UX tweak.
