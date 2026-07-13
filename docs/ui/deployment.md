---
id: deployment
title: Deployment
sidebar_position: 8
---

# Deployment

## Docker

The UI ships with a multi-stage `Dockerfile` that builds the app and serves the static
output with [`serve`](https://www.npmjs.com/package/serve) on port `3000`.

```bash
docker build -t webmail-ui .
docker run -p 3000:3000 webmail-ui
```

## Docker Compose

```yaml
services:
  webmail-ui:
    image: rjyspl/webmail-ui:latest
    container_name: webmail-ui
    environment:
      - TZ=Asia/Kolkata
    ports:
      - '127.0.0.1:3000:3000'
    restart: always
```

```bash
docker compose up -d
```

## Reverse proxy

The container serves plain static files on port 3000 — put it behind your own
reverse proxy (nginx, Caddy, Traefik, etc.) for TLS termination in production.
