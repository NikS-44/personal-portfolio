---
description: Run ad-hoc Chrome DevTools check against the current branch
argument-hint: [path-or-url]
---
Ad-hoc browser check: **no** new feature work in this command, **no** full PR. Path or URL: $ARGUMENTS (default `/` on [http://localhost:3000](http://localhost:3000)).

1. `yarn verify` — fail → stop.  
2. `yarn dev` in the background (or the user’s running dev server) — ensure the app loads at the target URL.  
3. `builder` — “Phase 3 browser only: **no** file edits. Run the **chrome-devtools-verify** checklist for this URL.”  
4. Stop the dev server when you started it. Summarize: console, network, screenshots. Issues → note for a `/ship` or `/ship-light` run; this command does not edit the repo.

**Rules:** Always shut down a dev server you started, including on error.
