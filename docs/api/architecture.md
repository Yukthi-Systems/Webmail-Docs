---
id: architecture
title: Architecture
sidebar_position: 3
---

# Architecture

## Layers

```
api/
  main.py          # FastAPI app, CORS, global exception handler, router mounting
  routers/         # One file per resource — thin HTTP layer only
src/
  database/        # Postgres (x2) + Memcached connection pools & lifecycle
  imap/             # IMAP integration (per-request connections, no pooling)
  sieve/            # ManageSieve integration (per-request connections, no pooling)
  utils/
    models/        # Pydantic request/response models
    base/          # Shared imports, config constants, logging setup
```

Routers stay thin — they parse the request, call into `src/database`, `src/imap`, or
`src/sieve`, and shape the response. All the actual mail-server and database logic lives
in those integration modules.

## Authentication & sessions

There is no local password database for mailbox accounts. Instead:

1. `POST /user/login` takes an email + password and validates it by opening a **real**
   IMAP and SMTP connection to the mail server and logging in.
2. If that succeeds, the full session — email, the real IMAP/SMTP/Sieve credentials,
   and some derived IDs — is serialized and stored in **Memcached**, keyed by a
   generated session ID, with a TTL (3 hours by default).
3. The API sets that session ID as an httpOnly cookie, plus a second, JS-readable cookie
   the frontend uses to know a session exists, and a CSRF token header.
4. Every subsequent authenticated request reads the session out of Memcached and uses
   the stored IMAP/SMTP/Sieve credentials to talk to the mail server **on that request**
   — see below.

This means the API re-authenticates to the real mail server on essentially every
request, rather than holding a long-lived connection or using OAuth/tokens. It's simple
and works with any standard IMAP/SMTP/Sieve server, at the cost of a login round-trip
per request.

## Why every mail request opens a new IMAP/Sieve connection

`src/imap` and `src/sieve` do **not** pool connections. Each request that touches email,
folders, or filters:

1. Pulls the user's real IMAP (or Sieve) credentials out of their Memcached session.
2. Opens a fresh `IMAP4_SSL` (or ManageSieve) connection.
3. Logs in.
4. Does the one operation the endpoint needs.

IMAP connection attempts retry up to 3 times with exponential backoff (800ms → 1.6s →
3.2s) before giving up. This trades some latency for simplicity and statelessness — the
API has no long-lived per-user IMAP connections to leak, time out, or need to garbage
collect.

## Data storage

| Store | Used for |
|---|---|
| **PostgreSQL (primary)** | Domain configuration, per-user settings (as JSON), contacts, email templates |
| **PostgreSQL ("admin"/V2)** | A separate, legacy platform database used for IP/geography-based login restrictions and contact lookups for accounts migrated from an older system. If you're self-hosting fresh, you likely don't need this second database at all — see [Configuration](./configuration.md) |
| **Memcached** | Session storage only |

All Postgres access is raw parameterized SQL via `asyncpg` — there's no ORM in the
request path, despite SQLAlchemy being listed as a dependency.

## Outgoing mail

`POST /email/send` and `POST /email/draft` don't send mail themselves — they publish a
message to **RabbitMQ**, which the [RMQ worker](/docs/worker) picks up and actually
delivers via SMTP. This keeps the API request fast and decouples it from SMTP delivery
latency/retries.

## Error handling

Every domain-specific error in the codebase raises a single custom exception,
`All_Exceptions(message, status_code)`, caught by one global FastAPI exception handler
in `main.py` and turned into `{"message": "Oops! <message>"}` with the given status
code. There's no per-router try/except boilerplate — routers just let `All_Exceptions`
propagate.
