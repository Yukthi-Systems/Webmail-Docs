---
id: admin-panel
title: Admin Console
sidebar_position: 6
---

# Admin Console

Webmail UI ships with an internal admin console for **provisioning mail domains and
white-label branding**. This is operator tooling for whoever runs the platform — it is
not a per-user feature, has no role-based access control, and is gated by a single
shared secret rather than a user account.

:::caution
The admin console trusts a single static API key (`X-API-Key` header) sent with every
request — it does not use the normal session-cookie login. If you self-host, treat that
key like a root credential: anyone who has it can create, edit, and delete every mail
domain the API knows about.
:::

## Where it lives

- Route: `/1219/admin/*` (the numeric prefix is just path obfuscation — it isn't a
  meaningful ID, and it isn't a security boundary on its own)
- Login screen: `/1219/admin/login`, a single "Admin Key" field
- The key is kept in memory + `sessionStorage` for the session, and is automatically
  wiped as soon as you navigate to any route outside `/1219/admin/*`
  (`ApiKeyStorageGuard`, mounted at the app root)

## Domains tab

A paginated, searchable table of every mail domain the platform serves, each with its
mail server configuration:

- IMAP host + port
- SMTP host + port
- Sieve host + port
- Active flag
- "V2 user" flag (an integration flag for a legacy/platform user database — see
  [API Architecture](/docs/api/architecture) for what this connects to)

From here you can:

- **Add a domain** — opens a form for all of the above fields
- **Edit / delete** a domain from its row actions
- **View details** in a read-only modal
- **Bulk import** — upload a CSV/XLSX of domains, with per-row validation, a live
  progress indicator, per-row error reporting, and a downloadable error report for any
  rows that failed
- **Bulk edit** — the same flow, for updating many existing domains at once
- **Download CSV** — export the current domain list

## Branding tab

Configures white-label branding for a company "slug" — this is what powers the
`/:slug` branded login pages that end users see (a company's own logo and background
instead of the default Webmail UI look):

1. Enter the company's slug.
2. Load its existing config (display name, allowed email domains).
3. Upload up to four images: light-mode logo, dark-mode logo, light-mode background,
   dark-mode background.
4. Save.

Unlike the rest of the admin console, branding assets are uploaded to a **separate
service** — a DNS/branding microservice configured independently of the main API (see
`DNS_API_URL` / `DNS_API_KEY` in [Configuration](./configuration.md)).

## Should I expose this in production?

If you're self-hosting for a single organization, you likely don't need this at all —
domains can be configured once via the API directly. If you're running Webmail UI as a
platform for multiple tenants, this is the tool for that, but put it behind a network
boundary (VPN, IP allowlist, etc.) in addition to the API key — the API key alone is not
defense in depth.
