---
id: configuration
title: Configuration
sidebar_position: 5
---

# Configuration

All configuration is environment variables, read in `internal/config/config.go`. Every
variable has a built-in default, so the worker starts without any configuration at all
— set these explicitly for anything beyond local experimentation.

## RabbitMQ

| Variable | Purpose |
|---|---|
| `RB_HOST` / `RB_PORT` / `RB_USERNAME` / `RB_PASSWD` / `RB_VHOST` | RabbitMQ connection |
| `RB_MAIN_QUEUE` | Queue the worker consumes from (default `send_email`) |
| `RB_DEAD_QUEUE` | Dead-letter queue for failed messages (default `dead_emails`) |
| `RB_PREFETCH` | AMQP QoS prefetch count — how many unacked messages RabbitMQ will hand this connection at once (default `1`) |
| `RB_CONSUME_PREFETCH` | Currently read but not used to configure QoS separately from `RB_PREFETCH` |
| `RB_CONSUMER_TAG` | Consumer tag RabbitMQ sees for this instance — give each running instance a unique tag if you run more than one |
| `AMQPR_CON_DELAY` | Reconnect delay on connection failure (default `5s`) |

## Concurrency

| Variable | Purpose |
|---|---|
| `RB_WORKER_COUNT` | Number of goroutines processing deliveries concurrently (default `2`) |

SMTP and IMAP pool sizes (10 and 5 respectively) are currently hardcoded in
`cmd/consumer/main.go`, not environment-configurable.

## Logging

| Variable | Purpose |
|---|---|
| `LOG_FILE` | Log file path (default `logs/app.log`) |
| `LOG_MAX_SIZE_MB` | Rotate after this size (default `50`) |
| `LOG_MAX_BACKUPS` | Rotated files to keep (default `5`) |
| `LOG_MAX_AGE_DAYS` | Days to keep rotated files (default `14`) |
| `LOG_COMPRESS` | Gzip rotated files (default `true`) |
| `LOG_LEVEL` | zerolog level: `trace`/`debug`/`info`/`warn`/`error` (default `debug`) |
| `LOG_CONSOLE` | Also write logs to stderr (default `false`) |
