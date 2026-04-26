---
description: Paired screenshots — feature branch vs main (UI regressions)
---
Use when you need to compare **main** vs **this branch** for layout, scroll, or visual behavior (e.g. before/after a refactor).

**One-time setup**

- `yarn verify` on the feature branch — fail → stop.
- `FEATURE=$(git branch --show-current)`.

**On `main`**

1. `git fetch && git switch main && git pull`  
2. `yarn install` if `package.json` / `yarn.lock` changed vs your last install.  
3. `yarn dev` — if it fails, log the error and stop.  
4. Open the relevant URL (often [http://localhost:3000](http://localhost:3000) + path).  
5. Captures: `main-home.png` (or paired names you document in the PR).  
6. Stop the dev server (`Ctrl+C` or kill the process).

**On the feature branch**

1. `git switch "$FEATURE"`  
2. `yarn install` if needed.  
3. `yarn dev` — if it fails, log and stop.  
4. Same URL and viewport as on `main`.  
5. Captures: `branch-home.png` (paired names).  
6. Stop the dev server.

**PR:** Describe both images and any intentional visual changes. Reference paths under `verification/<branch-or-topic>/` if you save them there.

- Always **stop the dev server** after each segment, including on errors.
