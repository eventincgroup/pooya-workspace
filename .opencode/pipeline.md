# Pipeline

Stages live in [`pipeline.yaml`](pipeline.yaml). That file is the only full description. This page is an index.

`project` walks the yaml. It does not invent hops. Read `.opencode/constitution.md`, `.opencode/repos.md`, and `.opencode/design-rules.md` with it. Apply every design rule on every stage; stop if any is unmet.

Match **first `when` in `match_order`** — `refine` is first, so it beats greenfield when docs exist and the user is stating a change.

| Stage | When | Produces |
|---|---|---|
| **refine** | Spec + Plan + Technical Design exist, and you state a change or a bug | Patched docs (or a recorded no-change) + a PR for the delta |
| **design** | No Technical Design yet (or you asked to revisit it) | Linear document `Technical Design: <project>` |
| **spec** | Technical Design exists, no Spec | Linear document `Spec: <project>` |
| **plan** | Spec exists, no Plan | Linear document `Plan: <project>` |
| **slice** | Spec + Plan exist, no issues reference them yet | Dependency-ordered Linear issues |
| **build-issue** | A Todo-equivalent (`unstarted`) issue exists | PR per affected repo; issue in in-review (never Done) |

Shared subgraphs in the yaml (declared once): `doc-sync`, `apply-design-rules`, `incomplete-retry`. The `build` scope contract is also in the yaml — pass it verbatim; never hand `build` the full Plan.

To change a stage, edit [`pipeline.yaml`](pipeline.yaml).
