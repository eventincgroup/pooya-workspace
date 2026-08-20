# Agentic Dev Workflow

Three OpenCode agents that take a Linear project from a rough idea to an open pull request — drafting the Technical Design, turning the approved docs into a spec, a cross-repo plan and dependency-ordered issues, then implementing one issue at a time across `eventinc` and `nexus`.

The rule that shapes all of them: **every ambiguity becomes an explicit question, asked live, and is resolved before anything is written down.** Nothing is guessed to fill a gap, and nothing is deferred to "we'll figure it out during implementation."

And its counterpart, for the decisions that only *can* be made during implementation: **every decision is written back into the docs it affects, before the stage that made it continues.** Answer a question mid-build and the Spec, Plan and Technical Design are patched to match — including the sections the decision affects indirectly — so the next issue is never planned against a document that quietly stopped being true.

Everything each agent needs to resume lives in Linear, not in a session. You can close your terminal mid-project, come back next week, switch to the same agent, and it picks up from whatever already exists.

## The three agents

| Agent | Run it when | It produces |
|---|---|---|
| `technical-design` | The project has WWW, Pitch and Solution Brief, but no Technical Design yet | A `Technical Design: <project>` doc in Linear, checked against the real code before it's posted |
| `plan-project` | All four docs exist | `Spec: <project>` and `Plan: <project>` docs, then a dependency-ordered set of issues |
| `implement-project` | The project has planned issues | Code, verified against the issue's scope, landed as a PR per repo — plus every decision made along the way patched back into the three docs |

Run them in that order. Each one checks Linear first and tells you if you're not ready for it yet.

These are `mode: primary` agents, not slash commands — **Tab-cycle** into the one you want (or use your `switch_agent` keybind), then name or link a Linear project. There's no "continue" command; re-engaging an agent on the same project is how you resume.

Behind them sit fourteen subagents doing the investigation, drafting, verification and doc-syncing. You never invoke those directly.

## Prerequisites

- **OpenCode 1.18.18 or newer** — `opencode --version`
- **A Linear account** with access to the projects you'll work on
- **`gh` authenticated** — `gh auth status`. `implement-project` opens PRs through it.
- **Access to the `opencode-go` provider** and its `mimo-v2.5`, `mimo-v2.5-pro` and `qwen3.7-plus` models
- **This layout** — the repos as direct sub-directories of the workspace root, which is where you start `opencode`:

  ```
  workspace/
  ├── .opencode/       ← the agents and the design template
  ├── opencode.json    ← models, Linear MCP, built-in agent config
  ├── AGENTS.md
  ├── eventinc/
  └── nexus/
  ```

## Setup

1. Pull this repo into your workspace root, so `.opencode/` and `AGENTS.md` sit alongside your `eventinc` and `nexus` checkouts.
2. Start `opencode` from the workspace root.
3. The first time an agent reaches for Linear, you'll get an OAuth prompt in the browser. Approve it once; the token is yours and nothing is committed to this repo.
4. Check the install:

   ```bash
   opencode agent list
   ```

   You should see the three primaries, the fourteen subagents, and `build (all)`. If `build` says `primary` instead of `all`, see Troubleshooting.

## Using it

### 1. `technical-design`

Tab to `technical-design` and name your Linear project.

It pulls the WWW, Pitch and Solution Brief (the Solution Brief wins on any conflict), reads the design template, then sends scouts into `eventinc` and `nexus` in parallel to find the areas your feature touches. Anything the docs don't settle comes back to you as a direct question — expect a few rounds of this; it's the point, not friction.

Once you've reviewed the draft together, it runs a **feasibility check**: a separate verifier re-reads the finished draft against each repo's actual current code. Anything that doesn't hold up comes back to you as a decision, never a silent patch. When it's clean, the doc is posted to Linear.

If a Technical Design already exists, it loads it and asks what you want to revisit instead of starting over.

### 2. `plan-project`

Tab to `plan-project` and name the project. It needs all four docs present and will stop and tell you if one is missing.

Two stages, in this order on purpose:

- **Spec** — *what* the system does, deliberately with no mention of repos or technology. Acceptance criteria are written in EARS form ("When *X*, the system shall *Y*"), so each one is objectively checkable. Posted as `Spec: <project>`.
- **Plan** — *how and where* it gets built. A scout reads each repo, then a synthesizer merges everything into one cross-repo plan. Posted as `Plan: <project>`.

Then it **stops and asks** whether to break the plan into issues. That's a real question, not a check of Linear's state — review the docs in Linear first and come back when you're happy. Re-engaging the agent resumes at that gate.

Issues are sliced by user-visible value, not by layer or repo. A flow that genuinely needs both `eventinc` and `nexus` stays a **single** issue. Each issue carries only its scope and a precise pointer to the Spec/Plan sections that define the detail — never a copy of them, so revising a doc can't leave issues stale.

Questions raised while planning the *technical* side are often really questions about behaviour, and by then the Spec is already posted. When your answer changes something a posted doc says, it's patched into that doc before planning continues — you'll see it say which section it revised. Re-engaging the agent on a project that's already been implemented against works the same way in reverse: it notices the docs have moved since the issues were cut, tells you what may no longer line up, and asks before touching anything.

### 3. `implement-project`

Tab to `implement-project` and name the project. It picks the earliest unblocked issue in dependency order, or asks you if the ordering is genuinely ambiguous.

It fetches **only** the Spec and Plan sections that issue references — the full Plan never reaches the code-writing agent, so a neighbouring issue's work structurally can't leak in. That scope is resolved into a concrete checklist, built one repo at a time (never in parallel), and verified after each leg.

Verification weights doing **too much** as heavily as doing too little. Mechanical defects (a lint failure, a missing mandated test) are fixed automatically and still named in the final report. Everything else — every scope dispute, every over-implementation finding — comes to you as a decision.

**Every decision you make here goes back into the docs before the run continues.** That's the part worth knowing about, because it's where most of the questions you'll be asked come from:

- The decision is first recorded on the issue as a comment, marked `sync: pending`, before anything is edited. If the session dies there, the decision survives — the next run finds the unfinished record and picks it up.
- Then it's patched into whichever of the Spec, Plan and Technical Design it actually changes, **including the sections it changes indirectly**. One ruling on when a notification fires usually means a Spec criterion, a Plan section and a test case in the Technical Design, and it follows that chain until nothing contradicts it.
- A separate agent on a different model family checks each patch before it's saved: does it say what you actually decided, did anything unrelated get edited, is anything left in the doc contradicting it. If it can't tell, you get asked.
- The comment closes as `sync: done`, naming every section revised — and nothing lands as a PR while a `sync: pending` is still open.

Two things it deliberately won't do: writing something into the Plan doesn't authorise building it, so work a decision adds waits for a later issue; and it never creates or resizes issues, since slicing needs the whole plan in view. It patches the Plan and tells you `plan-project` needs another run.

Then it branches, commits, pushes and opens a PR using each repo's own conventions, and moves the issue to in-review. **It never marks an issue Done** — that means merged, which stays a human action behind both repos' review gates.

## Customizing

**Add a repo.** Each of the three primaries has a `Configured repos` block near the top of its file in `.opencode/agents/`. Add the name and its workspace-relative path (`./your-repo`) there. For `implement-project`, also give it that repo's format/test commands and branch/commit conventions. That block is the only place that needs to change.

**Change what a Technical Design looks like.** Edit `.opencode/templates/technical-design-template.md`. It's plain markdown, read fresh on every run — no agent file changes.

**Re-tier a model.** All models are assigned in the workspace-root `opencode.json` and nowhere else; agent files deliberately carry no `model:` line. Moving an agent between tiers is a one-line edit. See the [design doc](.opencode/README.md#model-policy) for which tier does what and why.

> **Editing permissions?** In OpenCode, later rules override earlier ones, so a `"*": deny` must be listed **first** in an allowlist. Put it last and it silently strips the tool entirely. Check any change with `opencode debug agent <name>`.

## Troubleshooting

**`opencode agent list` shows `build (primary)`, or `implement-project` can't write code.** The workspace-root `opencode.json` sets `agent.build.mode: "all"`, which is what makes the built-in `build` agent callable as a subagent. Confirm you're running `opencode` from the workspace root — that's the only place the project config is picked up.

**The agent says it has no Linear tools.** The OAuth flow hasn't completed. Check the server with `opencode mcp list`, then re-trigger it by asking the agent for any Linear project.

**A model is unavailable or access is denied.** You need the `opencode-go` provider configured — `opencode auth`. Check what you can actually reach with `opencode models opencode-go`.

**An agent refuses to delegate.** That's deliberate. Each primary has a `permission.task` allowlist naming exactly the subagents it may call. Inspect it with `opencode debug agent <name>`.

## How it works, and why

A few ideas do most of the work here:

- **Ask, never guess.** Any agent that can't confidently resolve something raises it instead of filling the gap.
- **Spec before plan.** *What* is fully settled before *how and where* is even considered.
- **Verify against reality.** A design that reads well isn't the same as one that's buildable, so a separate agent re-checks the finished draft against the actual code — on a different model family, so it doesn't rationalize its own work.
- **Bound scope by what you hand over.** The strongest guard against an agent doing the next issue's work isn't an instruction — it's never giving it the document that describes that work.
- **A decision isn't made until it's written down.** The conversation ends; the documents are what the next issue gets planned against. So every decision made after a doc was posted is patched back into it, in the stage that made it, gated by a verifier on a different model family.
- **Narrow, split write power.** `repo-ops` is the only agent that can touch git, through a git/gh allowlist, and it can't edit files. Everything that reasons about code can't land it.

The full rationale — orchestration diagrams, the per-agent table, the model policy and its costs, and what's deliberately out of scope — is in **[`.opencode/README.md`](.opencode/README.md)**.
