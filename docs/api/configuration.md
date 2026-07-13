---
id: configuration
title: Configuration
sidebar_position: 4
---

# Configuration

All configuration is read from environment variables in `src/utils/base/constants.py`.
There's no `.env.example` shipped yet — this page is the authoritative list.

## Database

| Variable | Purpose |
|---|---|
| `POSTGRES_DB_USERNAME` / `PASSWORD` / `HOST` / `PORT` / `DATABASE` | Primary Postgres connection — domains, user settings, contacts, templates |
| `POSTGRES_URI` | Overrides the individual fields above if set |
| `POSTGRES_POOL_SIZE` | Connection pool size (default `10`) |
| `ADMIN_POSTGRES_DB_USERNAME` / `PASSWORD` / `HOST` / `PORT` / `DATABASE` | A **second**, separate Postgres connection used only for legacy/platform lookups (IP-based login restrictions, migrated-account contact search) — see [Architecture](./architecture.md#data-storage). If you're self-hosting fresh, you can likely point this at the same database as the primary connection, or leave the related features unused |
| `ADMIN_POSTGRES_URI`, `ADMIN_POSTGRES_POOL_SIZE` | Same pattern as above |

## Session cache

| Variable | Purpose |
|---|---|
| `MEMCACHED_DB_HOST` / `PORT` / `POOL_SIZE` | Memcached connection |
| `MAX_AGE_OF_CACHE` | Session TTL in seconds (default `10800` = 3 hours) |

## Outgoing mail

| Variable | Purpose |
|---|---|
| `RABBITMQ_HOST` / `PORT` / `VIRTUAL_HOST` / `USERNAME` / `PASSWORD` | RabbitMQ connection, used to hand off outgoing/draft mail to the [RMQ worker](/docs/worker) |
| `RABBITMQ_EXCHANGE` / `ROUTING_KEY` | Where send/draft messages get published |

## Login protection

| Variable | Purpose |
|---|---|
| `GOOGLE_RECAPTCHA_PROJECT_ID` / `SITE_KEY` / `API_KEY` | Google reCAPTCHA Enterprise, validated server-side on `/user/login`. The `SITE_KEY` here must match the UI's `VITE_RECAPTCHA_KEY` (see [UI Configuration](/docs/ui/configuration)) |

## Logging & runtime

| Variable | Purpose |
|---|---|
| `LOG_LEVEL` | Python logging level (default `20` / `INFO`) |
| `NUMBER_OF_LOGS_TO_DISPLAY` | How many recent log lines the internal log viewer shows (default `100`) |
| `GUNICORN_ARG_WORKERS` / `THREADS` / `TIMEOUT` / `BIND_PORT` | Gunicorn runtime tuning (defaults `6` / `6` / `250` / `8086`) |

## Admin API key

Provisioning endpoints under `/user/admin/*` (see [Admin](./reference/admin.md)) are
protected by a static key compared against an `X-API-Key` header, rather than the
normal session-cookie login.

## Internal log viewer

`GET /logs/api` renders recent JSON log lines and is gated by a `?passwd=` query
parameter.
