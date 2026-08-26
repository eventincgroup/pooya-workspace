# Agentic Dev Workflow

One OpenCode primary — `project` — takes a Linear project from a rough idea to an open pull request, and later refinements (UX, “it doesn’t work”) back through the docs before the code.

The rule that shapes it: **every product ambiguity becomes an explicit question, asked live, and is resolved before anything is written down.** Facts the repo can answer are not questions — the scout goes back to the code.

And its counterpart: **every decision is written back into the Spec, Plan, and Technical Design before the stage that made it continues.** After a build, a refinement still patches those docs first, then implements only that delta.

Everything needed to resume lives in Linear, not in a session.

## How to run it

Tab-cycle to `project` (or your `switch_agent` keybind) and name or link a Linear project.

It reads Linear and matches a declared stage in [`.opencode/pipeline.md`](.opencode/pipeline.md):

| Linear has… | It runs |
|---|---|
| WWW, Pitch, Solution Brief — no Technical Design yet | **design** |
| Technical Design, no Spec | **spec** |
| Spec, no Plan | **plan** |
| Spec + Plan, you said yes to issues | **slice** |
| A Todo issue | **build-issue** |
| Docs exist and you describe a change / something broken | **refine** |

There is no “continue” command. Re-engaging `project` on the same Linear project is how you resume.

You never invoke the subagents directly.

## Prerequisites

- **OpenCode 1.18.18 or newer** — `opencode --version`
- **A Linear account** with access to the projects you'll work on
- **`gh` authenticated** — `gh auth status`
- **Access to the `opencode-go` provider** (`mimo-v2.5`, `mimo-v2.5-pro`, `qwen3.7-plus`)
- **This layout** — start `opencode` from the workspace root:

  ```
  workspace/
  ├── .opencode/       ← constitution, repos, pipeline, agents, template
  ├── opencode.json    ← models, Linear MCP, build.mode
  ├── AGENTS.md
  ├── eventinc/
  └── nexus/
  ```

## Setup

1. Pull this repo so `.opencode/` and `AGENTS.md` sit alongside `eventinc` and `nexus`.
2. Start `opencode` from the workspace root.
3. First Linear use: OAuth in the browser. The token is yours; nothing is committed.
4. Check: `opencode agent list` — you should see `project` (primary), the six custom subagents, and `build (all)`. If `build` says `primary` instead of `all`, see Troubleshooting.

## Adding a repo

Edit [`.opencode/repos.md`](.opencode/repos.md) only (name, path, format/test commands, git convention). That is the only list.

## Changing the Technical Design shape

Edit [`.opencode/templates/technical-design-template.md`](.opencode/templates/technical-design-template.md). Read fresh every design run.

## Changing a rule everyone follows

Edit [`.opencode/constitution.md`](.opencode/constitution.md) or [`.opencode/pipeline.md`](.opencode/pipeline.md). Do not copy those speeches into agent files.

## Re-tier a model

All models are in workspace-root [`opencode.json`](opencode.json). Agent files have no `model:` line. See [`.opencode/README.md`](.opencode/README.md#model-policy).

## Troubleshooting

**`opencode agent list` shows `build (primary)`, or `project` can't write code.** `opencode.json` must set `agent.build.mode: "all"`. Run OpenCode from the workspace root.

**The agent says it has no Linear tools.** Finish OAuth: `opencode mcp list`.

**A model is unavailable.** `opencode auth`, then `opencode models opencode-go`.

**An agent refuses to delegate.** `project`'s `permission.task` allowlist names exactly the subagents it may call. Inspect with `opencode debug agent project`.

The full rationale is in [`.opencode/README.md`](.opencode/README.md).
