# `.ai-rules/` (canonical copy in git)

| Path                 | Use                                                                                                                                                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rules/defaults.mdc` | Always-on: points to `CLAUDE.md` and this tree.                                                                                                                                                                                                 |
| `skills/**/SKILL.md` | e.g. **next-app**, **tech-debt**, **architecture-adr**, **design-doc**, **strict-tdd**, **systematic-debugging**, **improve-codebase**, **grill-me**, **branch-finishing**, **chrome-devtools-verify**, **commit**, **safe-dependency-updates** |
| `commands/*.md`      | Slash commands: `/ship`, `/ship-light`, `/verify`, etc.                                                                                                                                                                                         |
| `agents/*.md`        | **lead**, **architect**, **critic**, **builder**, **reviewer**                                                                                                                                                                                  |
| `mcp.json`           | MCP config (symlinked as `.cursor/mcp.json` and Claude Code’s `.mcp.json` after `yarn install` or `yarn run ai-rules:link`)                                                                                                                     |

**Context7 (optional):** The **context7** server in `mcp.json` reads `CONTEXT7_API_KEY` from your environment. Do not
commit API keys.

**Symlinks:** After `yarn install`, `.cursor` and `.claude` link here (see `scripts/ensure-ai-rules-symlinks.mjs`).
Repair anytime: `yarn run ai-rules:link`. On Windows, enable **Developer Mode** or run the shell elevated if Git
symlinks are off.

**This repo** does not use Fallow — verification is **`yarn verify`** and optional Chrome DevTools MCP for UI (see
`CLAUDE.md`).

**New machine:** clone → `yarn install` → `yarn verify`.
