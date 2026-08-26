# Design rules

Read this file during the **design** stage (and again when **refine** changes a user-facing screen or API). Add new design rules here — do not copy them into agent files.

`project` asks you. `investigate` and `compose` (mode `td`) use the answers. They never invent a route.

## Full routes — UI and API

For every user-facing screen and every API the feature uses, collect the **exact full URL** from the user before the Technical Design is posted.

Include host, port, path, and any stable query that is part of the route. Examples:

- UI: `http://localhost:4000/projects/new`
- API: `http://localhost:3232/graphql`

Do **not** guess a path because it looks plausible. If `investigate` found a candidate, still ask: “Is this the exact URL the user hits, or a different one?”

### How a route picks a repo

| URL contains | System | Repo |
|---|---|---|
| `localhost:3232` | Legacy (eventinc Rails + Next.js) | `./eventinc` |
| `localhost:4000` | Nexus | `./nexus` |

A feature can list routes on both. Write each route into the Technical Design **Routes** section, tagged with the repo. Later stages use that list to decide where the code change goes — not a vague “this feels like nexus.”

If a URL uses some other host or port, ask. Do not assume.

### What counts as one route

- One page or LiveView the user can open → one UI route.
- One HTTP endpoint the UI or another system calls → one API route.
- A screen that is only reached from the other app still gets its own full URL.

If the user does not know the URL yet, that is a `kind: product` question. Do not fill the Routes section with placeholders.
