---
id: admin
title: Admin
sidebar_position: 6
---

# Admin

These endpoints provision the mail domains the API knows how to talk to — which IMAP,
SMTP, and Sieve server to use for accounts under `@example.com`, say. This is what backs
the UI's [Admin Console](/docs/ui/admin-panel), and is operator/platform tooling, not an
end-user feature.

Every endpoint here is authenticated by a static key compared against an `X-API-Key`
header, rather than a user session — see [Configuration](../configuration.md).

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/user/admin/domains` | Paginated, searchable list of configured domains |
| `GET` | `/user/admin/domain/{domain}` | Get one domain's configuration |
| `POST` | `/user/admin/domain` | Create a domain |
| `PUT` | `/user/admin/domain/{domain}` | Edit a domain |
| `DELETE` | `/user/admin/domain/{domain}` | Delete a domain |

A domain config looks like:

```json
{
  "domain": "example.com",
  "imap_host": "imap.example.com",
  "imap_port": 993,
  "smtp_host": "smtp.example.com",
  "smtp_port": 587,
  "sieve_host": "imap.example.com",
  "sieve_port": 4190,
  "is_active": true,
  "is_v2_user": false
}
```

`is_v2_user` opts an entire domain into the legacy-platform integrations described in
[Architecture](../architecture.md#data-storage) (IP/geo login restriction, the
secondary admin-database contact search) — leave it `false` unless you specifically
need those.

Once a domain is created here, any account `user@that-domain` can log in via
[`POST /user/login`](./auth.md#post-userlogin) — the API looks up this configuration to
know which mail server to authenticate against.
