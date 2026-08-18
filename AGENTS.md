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
| `activepieces/` | Deployment config (Docker/Fly.io) | — | — | — | — | — |
| `architecture-reference/` | Documentation (Markdown) | — | — | — | — | — |
| `eventinc/` | Rails API + Next.js frontend | — | — | 2 | Yes | — |
| `gateway/` | Meteor 3.x + React 18 + TypeScript | Yes | — | — | — | 22 agents, 23 skills |
| `linear-master/` | Elixir/Phoenix 1.8 | Yes (in `linear_master/`) | — | — | — | — |
| `nexus/` | Elixir/Phoenix (event management) | Yes | 13 | 3 | — | — |
| `roxie/` | Go microservice (PDF processing) | — | — | — | — | — |

### Usage notes

- **architecture-reference**: Read-only documentation. Do not edit unless explicitly asked.
