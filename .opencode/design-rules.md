# Design rules

Every pipeline agent reads this file at the start of a run and follows **every** rule in it — design, spec, plan, slice, build, and refine. Add a new heading here to add a rule. Do not copy rules into agent files or into `pipeline.yaml`.

`project` asks you when a rule needs a product answer. Helpers use those answers; they never invent what a rule says to collect. If a later stage already has what a rule needs (for example the Routes table is filled), it uses that data — it does not skip the file.

---

## Full routes — UI and API

For every user-facing screen and every API the feature uses, collect the **exact full URL** from the user before the Technical Design is posted. Later stages use that list to decide where the code change goes.

Include host, port, path, and any stable query that is part of the route. Examples:

- UI: `http://localhost:4000/projects/new`
- API: `http://localhost:3232/graphql`

Do **not** guess a path because it looks plausible. If `investigate` found a candidate, still ask: “Is this the exact URL the user hits, or a different one?”

### How a route picks a repo

| URL contains | System | Repo |
|---|---|---|
| `localhost:3232` | Legacy (eventinc Rails + Next.js) | `./eventinc` |
| `localhost:4000` | Nexus | `./nexus` |

A feature can list routes on both. Write each route into the Technical Design **Routes** section, tagged with the repo. Repos Affected is derived from this list — not from a guess.

If a URL uses some other host or port, ask. Do not assume.

### What counts as one route

- One page or LiveView the user can open → one UI route.
- One HTTP endpoint the UI or another system calls → one API route.
- A screen that is only reached from the other app still gets its own full URL.

If the user does not know the URL yet, that is a `kind: product` question. Do not fill the Routes section with placeholders.

On **refine**, if the change is a screen or an API and the Routes section does not already have that URL, ask before patching docs or writing code.

A Technical Design (or a refine patch) that names a repo with no matching route, a route with no repo, or a claimed change with no route, fails the design gate.
