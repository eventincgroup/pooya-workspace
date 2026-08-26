# How the pipeline is built

Declared files are the source of truth. Agent files only describe a job (goal, inputs, outputs). They do not repeat the rules. Design-only rules live in [`design-rules.md`](design-rules.md) so you can add them without a second Tab agent.

| File | Role |
|---|---|
| [`constitution.md`](constitution.md) | Shared rules: ask vs look in code, status line, 3-round cap |
| [`repos.md`](repos.md) | Repos, local URLs (`3232` = eventinc, `4000` = nexus), git style |
| [`pipeline.md`](pipeline.md) | Stages: when to run, what to produce, when to stop and ask you |
| [`design-rules.md`](design-rules.md) | Extra rules for the **design** stage (and refine of screens/APIs) |

The **`project`** agent reads Linear, picks a stage, and runs it. Helpers never talk to you or to Linear.

```mermaid
flowchart TD
    User["You name a Linear project"] --> Project["project agent"]
    Project --> Files["constitution + repos + pipeline"]
    Files --> Stage{"What is already in Linear?"}
    Stage -->|"no Technical Design"| Design["design"]
    Stage -->|"no Spec"| Spec["spec"]
    Stage -->|"no Plan"| Plan["plan"]
    Stage -->|"you said yes to issues"| Slice["slice"]
    Stage -->|"a Todo issue"| BuildIssue["build that issue"]
    Stage -->|"docs exist and you want a change"| Refine["refine: docs then code"]
```

## Agents

| Agent | Job |
|---|---|
| `project` | Talks to you and Linear. Picks the stage. |
| `investigate` | Reads one repo. |
| `compose` | Writes or patches a document. |
| `gate` | Checks a design, a patch, or the code. |
| `slice` | Turns the plan into Linear issues. |
| `scope-resolver` | Turns an issue into a checklist. |
| `build` | Writes the code (built-in OpenCode agent). |
| `repo-ops` | One git or GitHub action per call. Only this agent may touch git. |

`project` may only call the helpers listed in its allowlist. `build` can use every tool, so it is *told* not to touch git; `gate` checks that it didn’t.

## Stages

Full detail is in [`pipeline.md`](pipeline.md). Short version:

- **design** — look at both repos, ask you for every full UI and API URL (`3232` = eventinc, `4000` = nexus), write a Technical Design, check it against the code, post it.
- **spec** — write *what* the system does. No repos or tech. Uses WWW, Pitch, and Solution Brief only.
- **plan** — write *how* and *where*. If your answer changes the Spec or Design, those docs get patched first.
- **slice** — only after you say yes. Issues point at the docs; they do not copy them. It will not build the whole plan if you skip this.
- **build-issue** — next Todo issue only (never backlog). Builds one repo at a time. Opens a PR. Never marks the issue Done.
- **refine** — after a build, when you report UX or “it doesn’t work”. Updates Spec / Plan / Design if needed, then changes only that bit of code.

## Config

[`opencode.json`](../opencode.json) lives at the **workspace root**, not inside `.opencode/`. It holds:

- Linear (OAuth)
- `agent.build.mode: "all"` — required, or `project` cannot write code
- Each agent’s model

Models are only set in that file. Agent markdown has no `model:` line.

If you edit permissions: later rules win, so `"*": deny` must come **first**. Check with `opencode debug agent <name>`.

## Review comments

The [`apply-pr-comments`](skills/apply-pr-comments/SKILL.md) skill is not a second pipeline. It applies review comments, commits through `repo-ops`, and updates the docs if a comment changes behaviour.

## What it will not do

- Start from a Linear @mention
- Edit WWW, Pitch, or the Solution Brief (if a decision fights the Brief, it asks you)
- Merge the PR (that stays a human step)
- Clamp `build`’s tools in config (that would also limit everyday coding)
