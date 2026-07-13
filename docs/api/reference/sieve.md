---
id: sieve
title: Sieve Filters
sidebar_position: 5
---

# Sieve Filters

Server-side mail filtering, managed over the
[ManageSieve](https://www.rfc-editor.org/rfc/rfc5804) protocol (via the
[`sievelib`](https://pypi.org/project/sievelib/) library), the same way an email client
like Thunderbird would manage filters on a Sieve-capable mail server. Like IMAP, each
request opens its own ManageSieve connection using the credentials from the caller's
session — see [Architecture](../architecture.md#why-every-mail-request-opens-a-new-imapsieve-connection).
This backs the UI's [Sieve Filters](/docs/ui/features#sieve-filters) feature.

There are two levels here: **scripts** (whole Sieve programs) and **filters** (named
rules within a script). Most day-to-day usage only needs the filter endpoints — the
script endpoints exist for managing multiple filter sets and switching between them.

## Scripts

A mail account can hold several named scripts, but only one is active at a time.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/sieve/scripts` | List all scripts — `{active, scripts: [...]}` |
| `POST` | `/sieve/scripts/{script_name}` | Create/overwrite a script from raw Sieve source |
| `GET` | `/sieve/scripts/{script_name}/raw` | Get a script's raw source text |
| `POST` | `/sieve/scripts/{script_name}/enable` | Make this the active script |
| `PUT` | `/sieve/scripts/{old_script_name}/rename/{new_script_name}` | Rename a script |
| `DELETE` | `/sieve/scripts/{script_name}` | Delete a script |

## Filters

Filters are structured rules that live *inside* a script. The API parses the script's
raw Sieve source, applies your change through `sievelib`'s filter-set API, then
re-serializes the whole script and pushes it back — you never write raw Sieve syntax
yourself through these endpoints (though you can via the raw script endpoints above, if
you prefer).

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/sieve/filters/{script_name}` | List filters in a script — `[{name, enabled}, ...]` |
| `GET` | `/sieve/filters/{script_name}/{filter_name}` | Get one filter's full detail: conditions, actions, match type, enabled state, and the regenerated script content |
| `POST` | `/sieve/filters/{script_name}` | Create a filter |
| `PUT` | `/sieve/filters/{script_name}/{filter_name}` | Update a filter |
| `POST` | `/sieve/filters/{script_name}/{filter_name}/enable` | Enable a filter |
| `POST` | `/sieve/filters/{script_name}/{filter_name}/disable` | Disable a filter without deleting it |
| `DELETE` | `/sieve/filters/{script_name}/{filter_name}` | Delete a filter |

### Filter shape (`SieveFilters`)

```json
{
  "name": "Archive newsletters",
  "match_type": "anyof",
  "conditions": [
    ["Subject", ":contains", "Newsletter"],
    ["From", ":contains", "noreply@"]
  ],
  "actions": [
    ["fileinto", "Newsletters"]
  ]
}
```

- **`conditions`** — a list of `[field, comparator, value]` triples. Common fields:
  `Subject`, `From`, `To`. Common comparators: `:contains`, `:matches`, `:is`.
- **`match_type`** — `allof` (all conditions must match, i.e. AND) or `anyof` (any one
  is enough, i.e. OR). This is IMAP/Sieve's actual logic model — there's no nested
  AND/OR, and no built-in NOT at this level (negate at the comparator/value level
  instead, e.g. match on the opposite condition).
- **`actions`** — a list of `[action, ...args]` pairs. Common actions:
  `["fileinto", "FolderName"]` (move to folder), `["discard"]`, `["redirect", "addr"]`.

### Step by step: creating a filter that archives newsletters

1. `GET /sieve/scripts` to find (or `POST` to create) the script you want to add the
   filter to.
2. `POST /sieve/filters/{script_name}` with a body like the example above.
3. The server parses the existing script, adds your filter (enabled by default),
   re-serializes the whole script, and uploads it via `PUTSCRIPT`.
4. If that script isn't already the active one, `POST /sieve/scripts/{script_name}/enable`.

This mirrors exactly what the UI's filter builder does when you use
**Settings → Filter** — the UI has no separate filtering logic of its own, it's a form
in front of these same endpoints.
