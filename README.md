# Webmail Docs

Documentation site for **Webmail** — a fast, modern, self-hostable email
client. Built with [Docusaurus](https://docusaurus.io/).

This repo covers three products, each with its own docs section:

- **UI** — the React frontend ([`/docs/ui`](docs/ui))
- **API** — the FastAPI backend ([`/docs/api`](docs/api))
- **RMQ Worker** — the Go mail-delivery worker ([`/docs/worker`](docs/worker))

## Development

```bash
npm install
npm start
```

Starts a local dev server with hot reload at `http://localhost:3000`.

## Build

```bash
npm run build
```

Generates a static production build into `build/`, servable by any static host.

```bash
npm run serve
```

Serves that production build locally.

## Contributing

See [Open Source & Contributing](https://yukthi-systems.github.io/Webmail-Docs/open-source)
for how to contribute and how serious contributions are recognized.

## License

GPLv3 — see [`LICENSE`](LICENSE).
