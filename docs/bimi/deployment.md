---
id: deployment
title: Deployment
sidebar_position: 5
---

# Deployment

## Docker

Multi-stage build: `npm install` + `npm run build` in a builder stage, then only
`dist/` and production dependencies copied into the final `node:21.5-alpine3.18` image.

```bash
docker build -t webmail-bimi-api .
```

The image exposes port `3001` and has a built-in `HEALTHCHECK` that polls `/`.

## Docker Compose

The repo's own `docker-compose.yml` is a minimal starting point:

```yaml
services:
  dns-lookup-api:
    build: .
    container_name: dns-lookup-api
    env_file:
      - .env
    ports:
      - "127.0.0.1:3001:3001"
    restart: always
    volumes:
      - ./data:/data
```

For a self-hosted deployment alongside [Webmail UI](/docs/ui), you'll want to also set
`DOMAIN_IMAGES_PATH` / `COMPANIES_CONFIG_PATH` explicitly and mount that same volume path:

```yaml
services:
  webmail-bimi-api:
    image: your-registry/webmail-bimi-api:latest
    container_name: webmail-bimi-api
    environment:
      - PORT=3001
      - NODE_ENV=production
      - CORS_ORIGIN=https://mail.yourcompany.com
      - API_KEYS=webmail-ui:<generate-with-npm-run-genkey>
      - DOMAIN_IMAGES_PATH=/data/images
      - COMPANIES_CONFIG_PATH=/data/config/companies.json
    ports:
      - "127.0.0.1:3001:3001"
    volumes:
      - ./data:/data
    restart: always
```

Note the port binds to `127.0.0.1` only — put a reverse proxy (nginx, Caddy, Traefik) in
front of it for TLS termination and public exposure, same as the UI and API.

If you scale to multiple replicas, they must share the `./data` volume (or equivalent) —
see [Architecture](./architecture.md#branding-config--assets) for why: branding config
and images are a flat file and a directory, not a database.

Then point [Webmail UI](/docs/ui)'s Admin Console at it via `VITE_DNS_API_URL` and
`VITE_DNS_API_KEY` — see [UI Configuration](/docs/ui/configuration#admin-console--branding-service).
