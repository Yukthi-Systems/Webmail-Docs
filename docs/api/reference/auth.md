---
id: auth
title: Authentication
sidebar_position: 1
---

# Authentication

All endpoints under `/user` except login are session-authenticated — see
[Architecture](../architecture.md#authentication--sessions) for how the session model
works end to end.

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/user/login` | Log in with a real mailbox email + password |
| `DELETE` | `/user/logout` | End the current session |
| `GET` | `/user/validate` | Check whether the current session is still valid |
| `GET` | `/user/settings` | Get the current user's settings (arbitrary JSON) |
| `PUT` | `/user/settings` | Replace the current user's settings |
| `DELETE` | `/user/delete` | Delete the current user's account row and end the session |

## `POST /user/login`

Body (`AuthRequest`):

```json
{
  "email": "user@example.com",
  "password": "••••••••",
  "domain": "example.com",
  "recaptcha_token": "..."
}
```

What happens, in order:

1. The reCAPTCHA token is validated against Google's API.
2. The API looks up `example.com`'s server configuration (IMAP/SMTP/Sieve
   host+port) in Postgres — this is exactly what the
   [Admin Console](/docs/ui/admin-panel) provisions.
3. If the domain is flagged as a "V2" (legacy-platform) domain, the API additionally
   checks an IP/geography block list and resolves some legacy mailbox/domain IDs from
   the secondary "admin" Postgres database.
4. The API opens a real IMAP connection and a real SMTP connection and logs in with the
   given credentials. If either fails, login fails — there's no separate password store
   to fall back on.
5. On success, a session is created in Memcached (see
   [Architecture](../architecture.md#authentication--sessions)) and the response sets:
   - `SESSION_ID` — httpOnly cookie
   - `IS_SESSION_VALID` — a plain (JS-readable) cookie the frontend uses to know a
     session exists without needing to read the httpOnly one
   - `X-CSRF-Token`, `X-Session-Expiry`, `X-V2-User` — response headers

Both cookies are scoped to the deployment's cookie domain, configured in code — if
you're self-hosting under your own domain, set this to match.

## `PUT` / `GET /user/settings`

Settings are stored as an **arbitrary JSON blob** per user in Postgres — there's no
fixed settings schema enforced server-side. The UI's Settings screens (see
[UI Features](/docs/ui/features#appearance)) read and write specific keys within that
blob (`ui.theme`, `email.show_recipient`, etc.), but the API itself doesn't validate
the shape.
