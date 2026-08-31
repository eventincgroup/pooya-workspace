# Agentic Dev Workflow

An OpenCode agent that takes a Linear project from idea to pull request — or a standalone incident issue to a PR.

Two rules:

1. **If it is a product choice, it asks you.** It does not guess. If the answer is in the code, it looks there instead of asking.
2. **Docs stay true.** When something is decided, it updates the Spec, Plan, and Technical Design before it continues. After a build, if you say “this doesn’t work” or want a UX change, it updates those docs first, then fixes only that bit of code. **Incidents** have no project docs: findings and your feedback are commented on the issue.

State lives in Linear. You can close the session and pick up later.

## Use it

1. Start OpenCode from this workspace root.
2. Switch to the **`project`** agent (Tab, or your switch-agent key).
3. Name or paste a Linear project.

It looks at what already exists in Linear and does the next step:

- No Technical Design yet → writes one (with you).
- Design is there, no Spec → writes the Spec (*what* the system does).
- Spec is there, no Plan → writes the Plan (*how* and *where*).
- Plan is there → asks if you want issues, then cuts them.
- A Todo issue is ready → builds it and opens a PR.
- Docs exist and you describe a change or a bug → updates the docs, then the code.

There is no “continue” command. Switch to `project` again on the same Linear project to resume.

There is no separate “design” agent in Tab. Design is the first **stage** of `project`. To add a design rule that every stage must follow, edit [`.opencode/design-rules.md`](.opencode/design-rules.md) — do not add another primary.

### Incident (one issue, no project)

1. Switch to the **`incident`** agent.
2. Paste a Linear issue URL or ID.

The issue must already say what is broken, how to see it, and expected vs actual. If it does not, `incident` stops and comments what is missing.

It maps repos, investigates the code, proposes a plan (you confirm those steps), applies it, and opens a PR from the latest default branch without waiting for another yes. Findings and your feedback are commented on the issue.

You do not call the helper agents yourself.

## Setup

Do not clone this whole workspace. Clone `eventinc` and `nexus` as siblings, then add this plugin in `opencode.json` at that folder.

You need:

- OpenCode 1.18.18 or newer (`opencode --version`)
- Linear access
- `gh` logged in (`gh auth status`)
- The `opencode-go` models
- `eventinc` and `nexus` cloned as folders in the same directory

Layout:

```text
your-workspace/          ← start OpenCode here, not inside either repo
  opencode.json
  eventinc/
  nexus/
```

`opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "@eventincgroup/opencode-pipeline@git+ssh://git@github.com/eventincgroup/pooya-workspace.git"
  ]
}
```

On startup the plugin writes `.opencode/` (agents, `repos.md`, pipeline graphs) and fills in Linear MCP, models, and `agent.build.mode`. Do not copy those files yourself. Do not edit the synced `.opencode/` files — they are overwritten on each start; change this repo instead.

Then:

1. Run `opencode` from that workspace root.
2. The first time it uses Linear, approve OAuth in the browser. The token stays on your machine.
3. Run `opencode agent list`. You should see `project`, `incident`, and `build (all)`. If `build` says `primary`, see [If it breaks](#if-it-breaks).

If that folder is a git repo and you do not want to commit the generated `.opencode/` directory, add `.opencode/` to `.gitignore`. If it is just a directory of two clones, skip this — gitignore does not apply.

## Change how it works

| You want to… | Edit |
|---|---|
| Add a repo | [`.opencode/repos.md`](.opencode/repos.md) only |
| Add a design rule (applies on every stage) | [`.opencode/design-rules.md`](.opencode/design-rules.md) |
| Change a project stage | [`.opencode/pipeline.yaml`](.opencode/pipeline.yaml) |
| Change an incident stage | [`.opencode/incident.yaml`](.opencode/incident.yaml) |
| Change a shared rule | [`.opencode/constitution.md`](.opencode/constitution.md) |
| Change the Technical Design outline | [`.opencode/templates/technical-design-template.md`](.opencode/templates/technical-design-template.md) |
| Change which model an agent uses | [`opencode.json`](opencode.json) (not the agent files) |

How it is put together: [`.opencode/README.md`](.opencode/README.md).

## If it breaks

**`build` shows as `primary`, or `project` / `incident` cannot write code.** Run OpenCode from the workspace root. `opencode.json` must set `agent.build.mode` to `"all"`.

**It has no Linear tools.** Finish OAuth: `opencode mcp list`.

**A model is missing.** `opencode auth`, then `opencode models opencode-go`.

**It will not call a helper agent.** Check with `opencode debug agent project` or `opencode debug agent incident`.
