---
id: architecture
title: Architecture
sidebar_position: 3
---

# Architecture

## Layers

```
src/
  server.ts            # process entry point — starts app.listen(), handles SIGTERM/SIGINT
  app.ts                # Express app: helmet, CORS, body parsing, route mounting
  routes/dns.ts          # all routes, despite the branding endpoints living here too
  controller/dns.ts       # every handler — DNS lookups, branding config, image serving
  middleware/
    apiKeyAuth.ts          # X-API-Key check
    rateLimiter.ts          # in-memory per-IP request counter
    validations.ts           # domain/selector query validation
  utils/
    configLoader.ts          # in-memory company config, backed by a JSON file
    logger.ts                 # console + daily rotating file logs
    error.ts                   # shared DNS "not found" → response mapping
  config/companies.json         # the actual branding config data
```

Everything routes through one controller file — there's no separate service layer; DNS
parsing, response shaping, and file I/O all happen directly in the request handlers.

## Request pipeline

For anything under `/api/*`:

1. `helmet()` — security headers
2. `cors()` — origins from `CORS_ORIGIN` (comma-separated), or `true` (reflect any
   origin) if unset
3. `apiKeyAuth` — requires a valid `x-api-key` header, **except** for `/health` and `/`
4. `rateLimiter` — in-memory per-IP counter, 1000 requests / 60s window
5. The route handler itself

`/health` and `/` (the root app-level routes, not `/api/dns/*`) skip both auth and the
route-level health handler — they're wired directly in `app.ts` before the `/api`
middleware chain.

:::note
The rate limiter's request counts live in a plain in-memory `Map`, keyed by
`x-forwarded-for` (first entry) or the socket's remote address. This resets on every
restart and isn't shared across replicas — if you run more than one instance behind a
load balancer, each instance enforces the limit independently, so the effective limit is
`1000 × replica count`.
:::

## DNS resolution

All DNS lookups go through Node's `dns` module with custom resolvers set explicitly at
startup (`setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"])`) — the service does **not** use
whatever resolver the host OS is configured with. Every query races against a 5-second
timeout (`Promise.race`) so a slow/unresponsive upstream can't hang a request
indefinitely.

Record parsing is done by hand (splitting on `;`, matching `key=value` prefixes) rather
than with a DNS-record parsing library, for each of:

| Endpoint | Query | Looks for |
|---|---|---|
| `GET /api/dns/bimi` | `TXT default._bimi.<domain>` | `v=bimi1` |
| `GET /api/dns/spf` | `TXT <domain>` | `v=spf1` prefix |
| `GET /api/dns/dkim` | `TXT <selector>._domainkey.<domain>` (selector defaults to `mailsvc`) | `v=dkim1` |
| `GET /api/dns/dmarc` | `TXT _dmarc.<domain>` | `v=dmarc1` |
| `GET /api/dns/mx` | `MX <domain>` | — (sorted by priority) |
| `GET /api/dns/a-record` | `A <domain>` | — |
| `GET /api/dns/validate` | all five above | combined pass/fail + score |

See [DNS Records reference](./reference/dns-records.md) for exact response shapes.

## Error handling

`handleDNSNotFoundErrors` (in `utils/error.ts`) is called first in every DNS handler's
catch block. If the underlying error is `ENODATA` (query succeeded, no records) or
`ENOTFOUND` (domain doesn't resolve), it responds `404` with
`{ success: true, data: { exists: false } }` — a 404 status paired with `success: true`
is intentional here: the *lookup* succeeded, there's just nothing there. Any other error
(timeout, unexpected DNS failure) falls through to a `500` with `success: false`.

## Branding config & assets

`configLoader` (in `utils/configLoader.ts`) is a singleton that reads the whole
`companies.json` array into memory **once**, at process startup
(`COMPANIES_CONFIG_PATH`, defaulting to `src/config/companies.json`). Lookups
(`getBySlug`, `getByDomain`) are plain in-memory array scans — there's no reload/watch,
so an externally-edited config file won't be picked up until the process restarts.

`updateCompany` (used by `POST /api/dns/update-company`) is the one write path: it
merges the incoming company object into the in-memory array (asset fields are merged
individually so an update that only sends a new light-mode logo doesn't clobber an
existing dark-mode one), then serializes the whole array back to `COMPANIES_CONFIG_PATH`
on disk. This is a **single JSON file**, not a database — if you run multiple replicas,
they need a shared volume for both `COMPANIES_CONFIG_PATH` and `DOMAIN_IMAGES_PATH`, or
writes from one replica won't be visible to the others.

Image serving (`GET /bg-image`, `/logo-image`, and their `/:slug` variants) resolves the
company by slug or domain, picks the light or dark asset based on `?mode=dark`, and
serves the file straight off `DOMAIN_IMAGES_PATH`. There is no domain-based filename
fallback — if the config doesn't have an asset recorded for the requested type, the
endpoint returns `404` rather than guessing a filename.

Uploads (`POST /api/dns/update-company`, multipart with up to four files — `logo`,
`background`, `logoDark`, `backgroundDark`) land in the OS temp dir via `multer`, then
get copied into `DOMAIN_IMAGES_PATH` under a predictable name
(`<slug>-<type><extension>`) so re-uploading the same asset type overwrites the old file
rather than accumulating orphans.
