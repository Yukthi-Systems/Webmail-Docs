---
id: message-format
title: Message Format
sidebar_position: 4
---

# Message Format

This is the JSON contract for messages on the queue — whatever publishes a message
(currently [Webmail API](/docs/api)'s `/email/send` and `/email/draft` endpoints) must
match this shape, defined in `internal/models/models.go` as `EmailPayload`.

```json
{
  "is_draft": false,
  "from": {"name": "Ada Lovelace", "email": "ada@example.com"},
  "to": [{"name": "Grace Hopper", "email": "grace@example.com"}],
  "cc": [],
  "bcc": [],
  "subject": "Re: Analytical Engine",
  "reply_to": [],
  "body_text": "Plain-text body...",
  "body_html": "<p>HTML body...</p>",
  "attachments": [
    {"filename": "notes.pdf", "content_type": "application/pdf", "data": "<base64>"}
  ],
  "in_line_attachments": [
    {"filename": "logo.png", "content_type": "image/png", "data": "<base64>"}
  ],
  "folder_path": "Sent",
  "server_details": {
    "smtp": {"server": "smtp.example.com", "port": 587, "user": "ada@example.com", "password": "...", "security": "starttls"},
    "imap": {"server": "imap.example.com", "port": 993, "user": "ada@example.com", "password": "...", "tls": true}
  },
  "headers": {"Message-ID": "<abc123@example.com>"},
  "timestamp": "2024-01-15T09:30:00Z",
  "draft_saved": false,
  "draft_folder_name": "",
  "draft_message_id": ""
}
```

## Field notes

- **`is_draft`** — the top-level switch between the two processing paths described in
  [Architecture](./architecture.md#processmail-the-senddraft-decision-tree).
- **`server_details`** — the worker has no server config of its own; every message
  carries the real SMTP and IMAP host/port/credentials to use. This is intentional: the
  worker is stateless and per-domain server details already live in
  [Webmail API](/docs/api)'s domain configuration (see
  [API: Admin](/docs/api/reference/admin)).
- **`attachments` / `in_line_attachments`** — file contents travel as base64-encoded
  strings inside the JSON payload, not as separate binary parts. `content_type` is
  optional — if omitted, the worker sniffs it from the decoded bytes.
- **`headers`** — arbitrary extra headers merged into the built message. `Message-ID` in
  particular is what makes drafts and sent-mail cleanup work: the worker searches IMAP
  by this value, it doesn't track its own state between messages.
- **`folder_path`** — where the built message ends up on IMAP: the Sent folder for a
  send, or the draft folder for a draft save.
- **`draft_saved` / `draft_folder_name` / `draft_message_id`** — only relevant on a
  *send*: if the message being sent started life as a saved draft, these tell the worker
  where to find and delete that draft afterward.
