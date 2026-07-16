---
id: getting-started
title: Getting Started
sidebar_position: 2
---

# Getting Started

## Prerequisites

The API is a normal FastAPI app, but it has real external dependencies — there's no
in-memory/sqlite fallback mode, so you'll need these running before it will do anything
useful:

- **Python 3.12**
- **PostgreSQL** — for contacts, templates, per-user settings, and domain configuration
- **Memcached** — for session storage
- **RabbitMQ** — for outgoing/draft mail, consumed by the [RMQ worker](/docs/worker)
- An **IMAP + SMTP + ManageSieve** account to log in with — the API validates real
  credentials against a real mail server at login time, it does not have its own user
  database of mailbox passwords

If you just want to see the API running against your own mailbox, docker-compose spins
up Postgres and Memcached for you — see [Deployment](./deployment.md). RabbitMQ and a
mail server are still your responsibility to point it at.

## Clone and install

```bash
git clone https://github.com/Yukthi-Systems/WebMail-API.git
cd WebMail-API
python3 -m venv virtualenv
source virtualenv/bin/activate   # on Windows: virtualenv\Scripts\activate
pip install -r requirements.txt
```

## Configure environment variables

There's no `.env.example` in the repo — every variable and its default lives in
`src/utils/base/constants.py`. See [Configuration](./configuration.md) for the full
list; at minimum you'll want to set the Postgres, Memcached, and RabbitMQ connection
variables to point at your own instances rather than the built-in defaults.

## Run the dev server

```bash
uvicorn api.main:app --reload --port 8086
```

Then open `http://localhost:8086/docs` for interactive Swagger UI, or `/redoc` for
ReDoc.

## Run the way the Docker image runs it

In production the app runs under Gunicorn with Uvicorn workers (see
`scripts/entry_point.sh`):

```bash
gunicorn \
  --workers=6 --threads=6 --timeout=250 \
  --bind 0.0.0.0:8086 \
  -k uvicorn.workers.UvicornWorker api.main:app
```
