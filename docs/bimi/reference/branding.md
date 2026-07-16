---
id: branding
title: Branding
sidebar_position: 2
---

# Branding

These endpoints back [Webmail UI](/docs/ui)'s
[Admin Console → Branding tab](/docs/ui/admin-panel#branding-tab) and the branded
`/:slug` login pages end users see. All require the `x-api-key` header, and all operate
on the same underlying company config — see
[Architecture](../architecture.md#branding-config--assets) for how it's stored.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/dns/company-config` | Look up a company by `?slug=` or `?domain=` |
| `GET` | `/api/dns/company-config/:slug` | Same, by path param |
| `GET` | `/api/dns/bg-image` / `/bg-image/:slug` | Serve the background image for a company |
| `GET` | `/api/dns/logo-image` / `/logo-image/:slug` | Serve the logo image for a company |
| `POST` | `/api/dns/update-company` | Create or update a company's config + assets |

## `GET /api/dns/company-config`

Query with either `?slug=example` or `?domain=example.com` (slug takes precedence if
both are given).

```json
{
  "success": true,
  "data": {
    "slug": "example",
    "name": "Example Company",
    "domains": ["example.com"],
    "assets": {
      "logo": "example-logo.png",
      "background": "example-bg.jpg",
      "logoDark": "example-logo-dark.png",
      "backgroundDark": "example-bg-dark.jpg"
    },
    "theme": {
      "primaryColor": "#1a73e8",
      "secondaryColor": "#4285f4"
    }
  },
  "timestamp": 1721136000000
}
```

`404` if no company matches. `name` falls back to `slug` if unset.

## `GET /api/dns/bg-image` / `GET /api/dns/logo-image`

Query with `?slug=` or `?domain=`, and optionally `?mode=dark` to request the dark-mode
variant (falls back to the light-mode asset if no dark variant is configured). Responds
with the image file directly (`res.sendFile`), not JSON. `404` (JSON error envelope) if
the company or the specific asset isn't found — there's no filename-guessing fallback.

## `POST /api/dns/update-company`

`multipart/form-data` body:

| Field | Type | Notes |
|---|---|---|
| `slug` | string | Required. Identifies the company; creates a new entry if it doesn't exist, merges into the existing one if it does |
| `name` | string | Display name; falls back to `slug` |
| `domains` | string or string[] | Comma-separated string or repeated form field — the domains this branding applies to |
| `logo`, `background`, `logoDark`, `backgroundDark` | file | Any subset — only the fields you send are updated; omitted asset types keep their previously stored file |

```bash
curl -X POST http://localhost:3001/api/dns/update-company \
  -H "x-api-key: <your-key>" \
  -F "slug=example" \
  -F "name=Example Company" \
  -F "domains=example.com,example.org" \
  -F "logo=@./logo.png" \
  -F "backgroundDark=@./bg-dark.jpg"
```

Uploaded files are copied into `DOMAIN_IMAGES_PATH` as `<slug>-<type><extension>`
(e.g. `example-logo.png`), and the config file at `COMPANIES_CONFIG_PATH` is rewritten
in full. Re-running this for the same `slug` + asset type overwrites the previous file
rather than creating a new one.
