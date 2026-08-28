# Workspace AGENTS.md

This workspace contains multiple independent projects (repositories). A task may span one or more of them.

## Core Rules

### 1. Identify the target codebase(s)

A task or prompt may explicitly or implicitly reference one or more sub-directories in this workspace. Before doing any work:

- Extract every codebase reference from the user's prompt (e.g. "nexus", "eventinc", "gateway", "roxie").
- Derive the workspace-relative path from the reference (see directory index below).
- If a reference is ambiguous or could map to multiple projects, **stop and ask the user to clarify** which codebase(s) they mean.

### 2. When no codebase is specified

If the prompt does not mention any project by name and the task is not trivially scoped to the current open file, **you must ask the user which codebase(s) the task applies to**. Never assume or guess.

**Exception — Linear projects and incidents.** If the user names or links a Linear project (or is clearly running the OpenCode **project** pipeline), do not ask which codebase. Use the pipeline's configured repos in `.opencode/repos.md` (`eventinc` and `nexus` today). If they name or link a Linear **issue** and are running the **incident** agent, use that issue plus the same repo list.

### 3. Follow codebase-specific instructions

Every project may define its own AGENTS.md, rules, and skills. Once you have identified which codebase(s) to work in:

1. Read the project's `AGENTS.md` if it exists (see index).
2. If the project has a `.agents/rules/` directory, load every rule file in it.
3. If the project has a `.agents/skills/` directory, be aware those skills are available when working in that project.
4. If the project has a `.kilo/` directory, respect its agent/command definitions.
5. If the project has a `.cursor/` directory with agents or skills, load them as context for that project.

### 4. Multi-codebase tasks

When a task spans multiple codebases:
- Apply each codebase's own AGENTS.md and rules only to the work done inside that codebase.
- Keep cross-cutting changes consistent (e.g. shared API contracts) but defer to each project's conventions for implementation details.

## Directory Index

| Directory | Type | Has AGENTS.md | Has .agents/ rules | Has .agents/ skills | Has .kilo/ | Has .cursor/ |
|-----------|------|:---:|:---:|:---:|:---:|:---:|
| `architecture-reference/` | Documentation (Markdown) | — | — | — | — | — |
| `atlas/` | Documentation | — | — | — | — | — |
| `eventinc/` | Rails API + Next.js frontend | — | — | 2 | Yes | — |
| `gateway/` | Meteor 3.x + React 18 + TypeScript | Yes | — | — | — | 22 agents, 23 skills |
| `nexus/` | Elixir/Phoenix (event management) | Yes | 13 | 4 | — | — |
| `roxie/` | Go microservice (PDF processing) | — | — | — | — | — |
| `trigger/` | Trigger.dev tasks | Yes | — | 6 | — | — |

### Usage notes

- **architecture-reference**: Read-only documentation. Do not edit unless explicitly asked.
- **Linear-to-PR pipeline**: `.opencode/` — constitution, repos, `pipeline.yaml` (project graph), `incident.yaml` (incident graph), and design-rules files, plus the `project` and `incident` agents (runners, not interpreters). Design is a project stage, not a Tab agent. Every stage follows `.opencode/design-rules.md`; add a heading there to add a rule. Change a project stage in `.opencode/pipeline.yaml`; change an incident stage in `.opencode/incident.yaml`. Configured repos are only those listed in `.opencode/repos.md`.
