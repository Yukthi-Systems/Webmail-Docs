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
```

Prettier config (`.prettierrc`): 2-space indent, single quotes, semicolons, 80-char print
width, LF line endings.

## Workflow

1. Fork the repository
2. Create a branch for your change
3. Make your changes, following the existing folder conventions (see [Architecture](./architecture.md))
4. Run `npm run lint` and fix any issues
5. Open a pull request with a clear description of the change

## Reporting issues

Please include steps to reproduce, expected vs. actual behavior, and browser/OS info when
filing a bug report.
