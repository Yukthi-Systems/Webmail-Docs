---
id: configuration
title: Configuration
sidebar_position: 7
---

# Configuration

All configuration is centralized in `src/constants/config.ts` as `API_CONFIG`. Each
value is resolved in this order, first match wins:

1. **Runtime override** — `window._env_.VITE_*`, meant to be injected by a small script
   the Docker image writes at container start (so you can configure a built image
   without rebuilding it)
2. **Build-time env var** — `import.meta.env.VITE_*`, from a `.env` file read by Vite
3. **Hardcoded fallback** in `config.ts`

Copy `.env.example` to `.env` and adjust as needed for local development.

| Variable | Description | Notes |
|---|---|---|
| `VITE_API_URL` | Base URL of the Webmail API instance the UI should talk to | e.g. `http://localhost:8086` |
| `VITE_APP_VERSION` | App version string shown in Settings → About, the login screen, and the Help screen | Falls back to a hardcoded literal if unset — keep it in sync with `package.json`'s `version` manually, it is **not** read from `package.json` at runtime |
| `VITE_RECAPTCHA_KEY` | Google reCAPTCHA **site key** used on the login form | The API side validates the token against a matching secret key — see [API Configuration](/docs/api/configuration) |

### Admin console / branding service

These are only used by the [Admin Console](./admin-panel.md)'s Branding tab, which talks
to the [BIMI API](/docs/bimi) rather than the main API:

| Variable | Description |
|---|---|
| `VITE_DNS_API_URL` | Base URL of the [BIMI API](/docs/bimi) instance |
| `VITE_DNS_API_KEY` | Shared API key for that service (sent as `x-api-key`) |

:::note
Any variable exposed to the client **must** be prefixed with `VITE_` — this is a Vite
requirement, not specific to this project. That also means none of these values are
truly secret once the app is built and shipped to a browser — don't put anything in a
`VITE_*` variable that you wouldn't be comfortable with a user viewing your page's
network requests seeing.
:::
