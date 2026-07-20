---
id: contributing
title: Contributing
sidebar_position: 9
---

# Contributing

## Code style

The project uses ESLint + Prettier. Before opening a PR:

```bash
npm run lint
npm run format
```

Prettier config (`.prettierrc`): 2-space indent, single quotes, semicolons, 100-char print
width, LF line endings. The active lint config is the flat `eslint.config.js` — the repo
also has an `eslint.config.mjs` and a legacy `.eslintrc.json` sitting alongside it, but
neither is wired up; ignore both.

## Workflow

1. Fork the repository
2. Create a branch for your change
3. Make your changes, following the existing folder conventions (see [Architecture](./architecture.md))
4. Run `npm run lint` and `npm run build` (typecheck + build) locally and fix any issues
5. Open a pull request with a clear description of the change

CI (`.github/workflows/main.yml`) runs the same lint + typecheck + build on every PR,
plus a Docker build smoke test — a PR won't merge until those pass.

## Reporting issues

Use the GitHub issue forms (bug report, feature request, or question) rather than a blank
issue — they prompt for steps to reproduce, expected vs. actual behavior, and browser/OS
info up front.
