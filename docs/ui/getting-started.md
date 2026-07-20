---
id: getting-started
title: Getting Started
sidebar_position: 2
---

# Getting Started

## Prerequisites

- Node.js 20+ (CI builds and tests against Node 24 — use that if you hit version-specific
  issues)
- npm
- A running instance of the [Webmail API](/docs/api) (or its URL, if hosted elsewhere)

## Clone and install

```bash
git clone https://github.com/Yukthi-Systems/WebMail-UI.git
cd WebMail-UI
npm install
```

## Configure environment variables

Copy the example env file and point it at your API instance:

```bash
cp .env.example .env
```

See [Configuration](./configuration.md) for what each variable does.

## Run the dev server

```bash
npm run dev
```

This starts Vite's dev server with hot module reloading.

## Build for production

```bash
npm run build
```

This runs a full TypeScript project build (`tsc -b`) before invoking Vite, so it fails on
type errors even if `npm run dev` looked fine. Output is written to `dist/`. See
[Deployment](./deployment.md) for running it with Docker.
