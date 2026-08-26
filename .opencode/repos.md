# Configured repos

The only repo list for this pipeline. Primaries, subagents, and `apply-pr-comments` all read this file. To add a repo, edit this file — nowhere else.

## Integration surface

Already built. Check this before assuming a feature needs new plumbing between the two:

- **nexus** `Nexus.ESB.Legacy` (`lib/nexus/esb/legacy/`) mirrors eventinc models for nexus-side reads.
- **eventinc** `app/controllers/nexus/` exposes `/nexus/*` (`authenticate`, `signed_url`, `navigate`) for session/navigation handoff.

## eventinc

- Also called **legacy** in conversation.
- Local URL: `http://localhost:3232`
- Path: `./eventinc`
- Kind: Rails API + Next.js app under `nextjs/`
- Format/lint: `bundle exec rubocop -P -E -S`. Next.js: `yarn lint` from `nextjs/`.
- Tests: `bundle exec rspec spec --format progress` (root) or `make test` / `make test-all`. Next.js: `yarn test` from `nextjs/`. Prefer the repo's own test layout (request/model/service specs) — do not invent "domain function" or LiveView tests here.
- Branch: `<type>/<number>_<description>` (e.g. `feat/886_use_more_button`)
- Commit: `<type> #<number>: <description>`
- PR: no template. Write a plain Summary plus what was tested. Tribe labels (FE/BE) are a human step — report they are needed, never guess them.
- Conventions: `STYLEGUIDE.md` if present; `AGENTS.md` if present; `.agents/rules/` if present.

## nexus

- Local URL: `http://localhost:4000`
- Path: `./nexus`
- Kind: Elixir/Phoenix, bounded contexts under `lib/nexus/`
- Format: `mix format`
- Tests: `mix test` (full) or `mix test path/to/x_test.exs` (targeted). Follow `AGENTS.md` and `.agents/rules/testing-patterns.md` when present (conn_case, data_case, LiveView tests, integration tests).
- Branch: `<scope>/<type>/<name>` (e.g. `sourcing/feat/project-creation`)
- Commit: `<type>(<scope>): <subject>` — first line max 72 characters, imperative present tense ("add", not "added")
- PR: body from `.github/pull_request_template.md`. Leave both housekeeping checkboxes unchecked unless the user explicitly said otherwise. The auto-merge checkbox removes the human review gate.
- Conventions: `AGENTS.md`; load `.agents/rules/` as that file directs.

## Git types (both)

`feat`, `fix`, `perf`, `refactor`, `docs`, `style`, `test`, `build`.
