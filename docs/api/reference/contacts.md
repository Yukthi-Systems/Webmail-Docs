---
id: contacts
title: Contacts
sidebar_position: 4
---

# Contacts

Unlike email/folders, contacts are stored by the API itself in Postgres (`user_contacts`
table) — no IMAP round-trip involved. This backs the UI's
[Contacts](/docs/ui/features#contacts) feature.

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/contacts/create` | Create one contact |
| `GET` | `/contacts/item/{contact_id}` | Get one contact |
| `PUT` | `/contacts/item/{contact_id}` | Edit a contact |
| `DELETE` | `/contacts/item/{contact_id}` | Delete a contact |
| `GET` | `/contacts/list` | Paginated list. Query: `page`, `page_size` |
| `GET` | `/contacts/exists/{email}` | Check whether a contact with this email already exists |
| `GET` | `/contacts/search` | Typeahead search by partial email |
| `POST` | `/contacts/bulk` | Bulk-create — body is a list of contacts |
| `DELETE` | `/contacts/bulk` | Bulk-delete — body is a list of contact IDs |

A `Contact` looks like:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "phone": "+1-555-0100",
  "notes": "Met at the conference"
}
```

`GET /contacts/list` returns a pagination envelope rather than a bare array:

```json
{
  "total_count": 42,
  "total_pages": 3,
  "has_next": true,
  "has_previous": false,
  "data": [/* ... contacts ... */]
}
```

## `GET /contacts/search/v2`

A second search endpoint exists for accounts migrated from the legacy "V2" platform —
it searches a different table (`mailmanager_mailbox`) in the secondary admin database
instead of `user_contacts`, and only works when the logged-in user has a
`v2_domain_id` (set during login for domains flagged as V2 — see
[Authentication](./auth.md)). If you're self-hosting fresh without that legacy platform,
you won't need this endpoint.
