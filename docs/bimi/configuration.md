---
id: configuration
title: Configuration
sidebar_position: 4
---

# Configuration

All configuration is environment variables, loaded via `dotenv` in `src/app.ts`. Copy
`.env.example` to `.env` as a starting point.

## Server

| Variable | Purpose |
|---|---|
| `PORT` | Port the Express server listens on (default `3001`) |
| `NODE_ENV` | `development` enables full error messages in the JSON error response; anything else returns a generic `"Server error"` message |
| `CORS_ORIGIN` | Comma-separated list of allowed origins. If unset, CORS reflects **any** origin (`origin: true`) — set this explicitly in production |

## Authentication

| Variable | Purpose |
|---|---|
| `API_KEYS` | Comma-separated `name:key` pairs, e.g. `webmail-ui:abc123,internal-tool:def456`. Required as the `x-api-key` header on every `/api/*` request except `/health` and `/` |

Generate a key rather than hand-writing one:

```bash
npm run genkey -- <key-name>
```

This prints a random 32-byte hex key and the exact `API_KEYS=` line to add to `.env`
(comma-append it if you already have other keys configured).

## Branding & assets

| Variable | Purpose |
|---|---|
| `DOMAIN_IMAGES_PATH` | Filesystem directory the logo/background images are read from and written to (default `/data/images`) |
| `COMPANIES_CONFIG_PATH` | Path to the branding config JSON file (default `src/config/companies.json`) |

Both paths must be on a **shared, persistent volume** if you run more than one replica —
see [Architecture](./architecture.md#branding-config--assets). The company config file
is a flat JSON array; see [Branding reference](./reference/branding.md) for its shape.

## Not configurable via environment

- **DNS resolvers** — hardcoded to `8.8.8.8`, `1.1.1.1`, `8.8.4.4` in
  `controller/dns.ts`
- **DNS query timeout** — 5 seconds, hardcoded per query
- **Rate limit** — 1000 requests / 60-second window per IP, hardcoded in
  `middleware/rateLimiter.ts`
- **Default DKIM selector** — `mailsvc`, used whenever a request omits `?selector=`
