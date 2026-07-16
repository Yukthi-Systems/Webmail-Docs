---
id: getting-started
title: Getting Started
sidebar_position: 2
---

# Getting Started

## Prerequisites

- Node.js 20+
- npm
- Outbound DNS access (the service queries `8.8.8.8`, `1.1.1.1`, and `8.8.4.4`
  directly — see [Architecture](./architecture.md#dns-resolution))

There's no database to stand up — company branding config is a JSON file on disk, and
DNS lookups are stateless.

## Clone and install

```bash
git clone https://github.com/Yukthi-Systems/WebMail-BIMI-API.git
cd WebMail-BIMI-API
npm install
```

## Configure environment variables

```bash
cp .env.example .env
```

At minimum, generate a real API key rather than shipping with the default:

```bash
npm run genkey -- my-app-name
```

This prints an `API_KEYS=name:key` line to paste into `.env`. See
[Configuration](./configuration.md) for every variable.

## Run the dev server

```bash
npm run dev
```

This runs `tsx watch src/server.ts`, restarting on file changes. By default it listens
on port `3001` — check `http://localhost:3001/health`.

## Try it

```bash
curl "http://localhost:3001/api/dns/validate?domain=example.com" \
  -H "x-api-key: <your-key>"
```

## Build for production

```bash
npm run build
npm start
```

`build` compiles TypeScript to `dist/`; `start` runs the compiled output with
`node dist/server.js`. See [Deployment](./deployment.md) for the Docker image.
