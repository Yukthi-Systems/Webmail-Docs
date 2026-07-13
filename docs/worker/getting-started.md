---
id: getting-started
title: Getting Started
sidebar_position: 2
---

# Getting Started

## Prerequisites

- Go 1.23+
- A running RabbitMQ instance
- Network access to whatever IMAP/SMTP servers the messages you consume point at (the
  worker gets those credentials per-message, not from its own config — see
  [Message Format](./message-format.md))

## Clone and build

```bash
git clone https://github.com/your-org/rmq-webmail-composer.git
cd rmq-webmail-composer
go mod tidy
go build -o consumer ./cmd/consumer
```

## Configure environment variables

Every setting has a built-in default (see [Configuration](./configuration.md)), so the
binary will start without any environment variables set — but you'll want to at least
point `RB_HOST`/`RB_USERNAME`/`RB_PASSWD`/`RB_PORT`/`RB_VHOST` at your own RabbitMQ
instance rather than relying on the defaults baked into the binary.

## Run it

```bash
./consumer
```

Or directly with `go run`:

```bash
go run ./cmd/consumer
```

The worker logs to `logs/app.log` (JSON lines, rotated via
[lumberjack](https://github.com/natefinch/lumberjack)) by default. Set `LOG_CONSOLE=true`
to also mirror logs to stderr, which is useful while developing locally.

There's nothing to "hit" once it's running — it just sits there consuming from the
configured RabbitMQ queue. To see it do something, publish a message matching the
[Message Format](./message-format.md) to that queue, e.g. from a running
[Webmail API](/docs/api) instance sending a real email.
