---
id: dns-records
title: DNS Records
sidebar_position: 1
---

# DNS Records

All endpoints below require the `x-api-key` header (see
[Configuration](../configuration.md)) and are mounted under `/api/dns`. Every response
is wrapped in the same envelope:

```json
{
  "success": true,
  "data": { "...": "..." },
  "timestamp": 1721136000000
}
```

A domain that resolves but has no matching record still returns `success: true` with
`exists: false` — see [Architecture](../architecture.md#error-handling) for why a
completely unresolvable domain returns `404` while a resolvable-but-empty one returns
`200`.

| Method | Path | Query params | Purpose |
|---|---|---|---|
| `GET` | `/api/dns/bimi` | `domain` | BIMI logo record |
| `GET` | `/api/dns/spf` | `domain` | SPF record |
| `GET` | `/api/dns/dkim` | `domain`, `selector` (default `mailsvc`) | DKIM record |
| `GET` | `/api/dns/dmarc` | `domain` | DMARC policy record |
| `GET` | `/api/dns/mx` | `domain` | MX records, sorted by priority |
| `GET` | `/api/dns/a-record` | `domain` | A records |
| `GET` | `/api/dns/validate` | `domain`, `selector` | All five checks in one call, plus a score |

## `GET /api/dns/bimi`

```json
{
  "success": true,
  "data": {
    "exists": true,
    "domain": "example.com",
    "version": "BIMI1",
    "logo": "https://example.com/logo.svg",
    "record": "v=BIMI1; l=https://example.com/logo.svg;"
  },
  "timestamp": 1721136000000
}
```

Queries `TXT default._bimi.<domain>` and looks for a `v=bimi1` record (case-insensitive).

## `GET /api/dns/spf`

```json
{
  "success": true,
  "data": {
    "exists": true,
    "domain": "example.com",
    "record": "v=spf1 include:_spf.example.com ~all",
    "mechanisms": ["include:_spf.example.com", "~all"]
  },
  "timestamp": 1721136000000
}
```

Queries `TXT <domain>` directly (the apex) and looks for a record starting with
`v=spf1`.

## `GET /api/dns/dkim`

```json
{
  "success": true,
  "data": {
    "exists": true,
    "domain": "example.com",
    "selector": "mailsvc",
    "version": "DKIM1",
    "publicKey": "MIGfMA0GCSq...",
    "keyType": "rsa",
    "record": "v=DKIM1; k=rsa; p=MIGfMA0GCSq..."
  },
  "timestamp": 1721136000000
}
```

Queries `TXT <selector>._domainkey.<domain>`. `selector` defaults to `mailsvc` if
omitted — pass your own if the domain uses a different DKIM selector.

## `GET /api/dns/dmarc`

```json
{
  "success": true,
  "data": {
    "exists": true,
    "domain": "example.com",
    "policy": "quarantine",
    "subdomainPolicy": "reject",
    "percentage": 100,
    "rua": ["mailto:dmarc-reports@example.com"],
    "ruf": [],
    "record": "v=DMARC1; p=quarantine; sp=reject; rua=mailto:dmarc-reports@example.com"
  },
  "timestamp": 1721136000000
}
```

Queries `TXT _dmarc.<domain>` and looks for `v=dmarc1`.

## `GET /api/dns/mx`

```json
{
  "success": true,
  "data": {
    "exists": true,
    "domain": "example.com",
    "records": [
      {"exchange": "mx1.example.com", "priority": 10},
      {"exchange": "mx2.example.com", "priority": 20}
    ]
  },
  "timestamp": 1721136000000
}
```

## `GET /api/dns/a-record`

```json
{
  "success": true,
  "data": {
    "exists": true,
    "domain": "example.com",
    "ipAddresses": ["93.184.216.34"],
    "count": 1
  },
  "timestamp": 1721136000000
}
```

## `GET /api/dns/validate`

Runs MX, SPF, DKIM, DMARC, and BIMI lookups for a domain in one call and returns a
combined result plus a 0–100 score (`passed / 5 * 100`). Each of the five checks fails
independently — one DNS timeout doesn't abort the others.

```json
{
  "success": true,
  "data": {
    "domain": "example.com",
    "selector": "mailsvc",
    "timestamp": 1721136000000,
    "results": {
      "mx": {"recordName": "MX-Record", "exists": true, "isActive": true, "records": [...], "recordData": "...", "error": null},
      "spf": {"recordName": "SPF-Record", "exists": true, "isActive": true, "record": "...", "mechanisms": [...], "recordData": "...", "error": null},
      "dkim": {"recordName": "DKIM-Record", "exists": true, "isActive": true, "version": "DKIM1", "publicKey": "...", "keyType": "rsa", "recordData": "...", "error": null},
      "dmarc": {"recordName": "DMARC-Record", "exists": true, "isActive": true, "policy": "quarantine", "percentage": 100, "recordData": "...", "error": null},
      "bimi": {"recordName": "BIMI-Record", "exists": false, "isActive": false, "logo": "", "version": "", "recordData": "No BIMI record found", "error": null}
    },
    "summary": {"totalChecks": 5, "passed": 4, "failed": 1, "score": 80}
  },
  "timestamp": 1721136000000
}
```

This is the endpoint the UI's domain-health / DNS-validation views are built on — a
single round trip instead of five.

## `GET /api/dns/health`

Process-level health (uptime, memory usage) — distinct from the unauthenticated
`GET /health` mounted at the app root. Both exist; `/api/dns/health` requires an API key,
the root `/health` doesn't.
