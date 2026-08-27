# Agentic Dev Workflow

An OpenCode agent that takes a Linear project from idea to pull request.

Two rules:

1. **If it is a product choice, it asks you.** It does not guess. If the answer is in the code, it looks there instead of asking.
2. **Docs stay true.** When something is decided, it updates the Spec, Plan, and Technical Design before it continues. After a build, if you say “this doesn’t work” or want a UX change, it updates those docs first, then fixes only that bit of code.

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

You do not call the helper agents yourself.

## Setup

You need:

- OpenCode 1.18.18 or newer (`opencode --version`)
- Linear access
- `gh` logged in (`gh auth status`)
- The `opencode-go` models
- `eventinc` and `nexus` as folders next to this repo

Then:

1. Put `.opencode/` and `AGENTS.md` next to `eventinc/` and `nexus/`.
2. Run `opencode` from the workspace root.
3. The first time it uses Linear, approve OAuth in the browser. The token stays on your machine.
4. Run `opencode agent list`. You should see `project` and `build (all)`. If `build` says `primary`, see [If it breaks](#if-it-breaks).

## Change how it works

| You want to… | Edit |
|---|---|
| Add a repo | [`.opencode/repos.md`](.opencode/repos.md) only |
| Add a design rule (applies on every stage) | [`.opencode/design-rules.md`](.opencode/design-rules.md) |
| Change a stage | [`.opencode/pipeline.yaml`](.opencode/pipeline.yaml) |
| Change a shared rule | [`.opencode/constitution.md`](.opencode/constitution.md) |
| Change the Technical Design outline | [`.opencode/templates/technical-design-template.md`](.opencode/templates/technical-design-template.md) |
| Change which model an agent uses | [`opencode.json`](opencode.json) (not the agent files) |

How it is put together: [`.opencode/README.md`](.opencode/README.md).

## If it breaks

**`build` shows as `primary`, or `project` cannot write code.** Run OpenCode from the workspace root. `opencode.json` must set `agent.build.mode` to `"all"`.

**It has no Linear tools.** Finish OAuth: `opencode mcp list`.

**A model is missing.** `opencode auth`, then `opencode models opencode-go`.

**It will not call a helper agent.** Check with `opencode debug agent project`.
