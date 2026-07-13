---
id: email
title: Email
sidebar_position: 2
---

# Email

Every endpoint here talks IMAP to the mail server on the fly (see
[Architecture](../architecture.md#why-every-mail-request-opens-a-new-imapsieve-connection))
— there's no local mail cache or search index.

## Reading mail

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/email/fetch/{batch_size}/{page_number}` | Paginated fetch of a folder's messages, newest first. Query: `folder_path`, `full_headers` |
| `GET` | `/email/fetch-all` | Fetch a specific set of message IDs at once. Query: `folder_path`, `full_headers`, `email_ids` |
| `GET` | `/email/raw/{email_id}` | Download the raw RFC 822 source as a `message/rfc822` attachment. Query: `folder_path`, `mark_as_read` |
| `POST` | `/email/fetch-by-message-ids` | Fetch messages by their RFC `Message-ID` header rather than IMAP UID — useful for resolving a thread across folders |

## Searching

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/email/search/all` | Search a folder |

Body (`SearchMail`):

```json
{
  "folder_path": "INBOX",
  "from_": "someone@example.com",
  "subject": "Invoice",
  "size": {"comparator": "larger", "size": 1000000},
  "date_since": "2024-01-01"
}
```

All fields are optional and combined with **AND** only — the API builds a raw IMAP
`SEARCH` query from whichever fields you provide. There's no OR/NOT support at this
layer (IMAP itself supports it, but this endpoint doesn't expose it).

## Organizing

| Method | Path | Purpose |
|---|---|---|
| `PATCH` | `/email/copy` | Copy one or more messages to another folder |
| `PUT` | `/email/move` | Move messages (copy, then flag `\Deleted` + expunge from the source) |
| `PUT` | `/email/mark/read` | Mark as read |
| `PATCH` | `/email/mark/unseen` | Mark as unread |
| `PUT` | `/email/mark/flagged` | Flag (star) |
| `PATCH` | `/email/mark/unflagged` | Remove flag |
| `DELETE` | `/email/permanently` | Permanently delete (flag `\Deleted` + expunge — this skips Trash, it does not move there first) |

## Sending & drafting

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/email/send` | Send a message |
| `POST` | `/email/draft` | Save a draft |

Both are **multipart/form-data** requests: a `data` field containing the JSON-encoded
`SendMailForm` (to/cc/bcc, subject, body, in-reply-to, etc.), plus `attachments` and/or
`in_line_attachments` file parts. Neither endpoint delivers mail itself — both publish a
message to RabbitMQ, actually sent by the [RMQ worker](/docs/worker). Expect an
immediate response once the message is queued, not once it's delivered.

:::note
`/email/send`'s current implementation is marked in source as a candidate for
deprecation/replacement in a future version — check the running instance's `/docs` for
the latest shape before building against it.
:::

## Templates

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/email/templates` | List templates. Query `is_public` toggles domain-shared vs. personal templates |
| `GET` | `/email/template/{template_id}` | Get one template |
| `POST` | `/email/template` | Create a template |
| `PATCH` | `/email/template/{template_id}` | Edit a template |
| `DELETE` | `/email/template/{template_id}` | Delete a template |

These back the UI's [Templates](/docs/ui/features#composer) feature and are stored in
Postgres, not on the mail server.
