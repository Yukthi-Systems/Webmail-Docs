---
id: deployment
title: Deployment
sidebar_position: 5
---

# Deployment

## Docker

```bash
docker build -t webmail-api .
```

The image is based on `python:3.12-bookworm`, installs `requirements.txt`, and runs
Gunicorn with Uvicorn workers via `scripts/entry_point.sh` (see
[Getting Started](./getting-started.md#run-the-way-the-docker-image-runs-it)).

## Docker Compose

```yaml
services:
  webmail-api:
    image: your-registry/webmail-api:latest
    container_name: webmail-api
    environment:
      - TZ=UTC
      - GUNICORN_ARG_WORKERS=8
      - GUNICORN_ARG_THREADS=8
      - GUNICORN_ARG_TIMEOUT=180
      - GUNICORN_ARG_BIND_PORT=8086

      - POSTGRES_DB_USERNAME=<your-postgres-username>
      - POSTGRES_DB_PASSWORD=<your-postgres-password>
      - POSTGRES_DB_HOST=postgres-database
      - POSTGRES_DB_PORT=5432
      - POSTGRES_DB_DATABASE=webmail
      - POSTGRES_POOL_SIZE=10

      # Only needed if you use the legacy/platform "V2" lookups — see Architecture.
      - ADMIN_POSTGRES_DB_USERNAME=<your-admin-postgres-username>
      - ADMIN_POSTGRES_DB_PASSWORD=<your-admin-postgres-password>
      - ADMIN_POSTGRES_DB_HOST=<your-admin-postgres-host>
      - ADMIN_POSTGRES_DB_PORT=5432
      - ADMIN_POSTGRES_DB_DATABASE=<your-admin-postgres-database>
      - ADMIN_POSTGRES_POOL_SIZE=3

      - MEMCACHED_DB_HOST=memcached-database
      - MEMCACHED_DB_PORT=11211
      - MEMCACHED_DB_POOL_SIZE=50
      - MAX_AGE_OF_CACHE=10800

      - RABBITMQ_HOST=<your-rabbitmq-host>
      - RABBITMQ_PORT=5672
      - RABBITMQ_VIRTUAL_HOST=<your-vhost>
      - RABBITMQ_USERNAME=<your-rabbitmq-username>
      - RABBITMQ_PASSWORD=<your-rabbitmq-password>
      - RABBITMQ_EXCHANGE=web_mail
      - RABBITMQ_ROUTING_KEY=send_emails

      - GOOGLE_RECAPTCHA_PROJECT_ID=<your-recaptcha-project-id>
      - GOOGLE_RECAPTCHA_API_KEY=<your-recaptcha-api-key>
      - GOOGLE_RECAPTCHA_SITE_KEY=<your-recaptcha-site-key>

      - LOG_LEVEL=20
      - NUMBER_OF_LOGS_TO_DISPLAY=100
    ports:
      - "127.0.0.1:8086:8086"
    volumes:
      - /var/log/webmail-api:/var/log/api
    networks:
      - webmail-network
    restart: always

  postgres-database:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=<your-postgres-password>
      - POSTGRES_USER=<your-postgres-username>
      - POSTGRES_DB=webmail
    volumes:
      - /var/lib/postgresql/data:/var/lib/postgresql/data
    restart: always
    networks:
      - webmail-network

  memcached-database:
    image: memcached:1.6
    restart: always
    networks:
      - webmail-network

networks:
  webmail-network:
    driver: bridge
```

Note the `webmail-api` port binds to `127.0.0.1` only — put a reverse proxy (nginx,
Caddy, Traefik) in front of it for TLS termination and public exposure, same as the UI.

RabbitMQ itself and a real IMAP/SMTP/ManageSieve mail server aren't included in this
compose file — you're expected to either run those separately or point at existing
infrastructure.
