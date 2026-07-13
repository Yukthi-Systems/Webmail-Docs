---
id: architecture
title: Architecture
sidebar_position: 3
---

# Architecture

## Folder structure

```
cmd/consumer/        # main.go — wires everything together, handles shutdown signals
internal/
  config/             # env-var driven config, all fields with defaults
  consumer/           # RabbitMQ consumer loop + worker pool
  email/               # the actual business logic
    service.go          # ProcessMail — the send/draft decision tree
    builder.go           # RFC 822 message construction (enmime)
    smtp_sender.go        # pooled SMTP client
    imap_store.go          # pooled-ish IMAP client (append, search, delete)
  models/              # EmailPayload and friends — the queue message contract
  utils/                # small helpers (recipient extraction)
pkg/
  rabbit/               # thin wrapper over the AMQP client
  logger/                # zerolog + rotating file output
```

## Message flow

1. `main.go` loads config, sets up logging, opens a RabbitMQ connection, builds an SMTP
   connection pool and an IMAP connection pool, and starts the consumer.
2. The consumer declares the main queue and a dead-letter queue, then starts
   `RB_WORKER_COUNT` goroutines all reading from the same delivery channel — this is a
   classic Go worker-pool: RabbitMQ hands deliveries to whichever goroutine is free next.
3. Each worker processes one message at a time with a 60-second timeout, so a single
   stuck IMAP/SMTP call can't wedge that worker forever.
4. `ProcessMail` (in `internal/email/service.go`) does the actual work — see below.
5. On success, the message is acknowledged. On failure, the worker republishes the
   message body to the dead-letter queue with an added `x-dead-letter-reason` header
   describing what went wrong, then acknowledges the *original* message — so a failed
   send doesn't get redelivered in a loop, it's set aside for inspection instead.

## `ProcessMail`: the send/draft decision tree

Every message becomes one RFC 822 email (built once via `BuildEmail`, using enmime),
then one of two paths:

**Draft** (`is_draft: true`):
1. Search IMAP, in `folder_path`, for an existing message with the same `Message-ID`
   header.
2. If found, delete it (mark `\Deleted` + expunge) — this is what makes "save draft"
   idempotent; editing and re-saving a draft replaces it rather than piling up copies.
3. Append the newly built message to `folder_path`.

**Send** (`is_draft: false`):
1. Extract all recipients (To + Cc + Bcc) into a flat address list.
2. Send the built message over SMTP.
3. Append a copy to `folder_path` (typically the account's Sent folder).
4. If `draft_saved` is true (this send started from a saved draft), search
   `draft_folder_name` for `draft_message_id` and delete it — cleaning up the draft now
   that it's actually been sent.

## Connection pooling

Both SMTP and IMAP use a small hand-rolled pool (a buffered channel of ready
connections), not a general-purpose connection-pool library:

- **SMTP** (`smtp_sender.go`): security mode (implicit TLS vs. STARTTLS vs. plain) is
  auto-detected from the port (465 → TLS, 587/25 → STARTTLS) unless the message
  explicitly sets one. Plain-auth connections aren't pooled at all — each plain send
  opens and closes its own connection via `smtp.SendMail`. Pooled connections are tried
  first (non-blocking); if none are free, a temporary connection is dialed, used once,
  and either returned to the pool or closed if the pool is already full.
- **IMAP** (`imap_store.go`): `Append` follows the same try-pool-then-dial-temporary
  pattern as SMTP. `SearchByMessageID` and `DeleteByUIDs`, however, always dial a fresh
  connection rather than drawing from the pool — worth knowing if you're tuning
  concurrency, since a "draft save" does more fresh IMAP logins than a plain send does.

Both pools also expose a `WarmUp` method to pre-dial connections for a given server
config, though nothing in `main.go` currently calls it — connections are created lazily
on first use instead.
