---
id: deployment
title: Deployment
sidebar_position: 6
---

# Deployment

## Docker

```bash
docker build -t rmq-webmail-composer .
```

Multi-stage build: compiled with `golang:1.23-alpine`, then copied into a
`distroless/base-debian12` runtime image — just the binary, no shell, no package
manager, a small attack surface and a small image.

```bash
docker run -d rmq-webmail-composer
```

## Docker Compose

```yaml
services:
  rmq-webmail-composer:
    image: your-registry/rmq-webmail-composer:latest
    container_name: rmq-webmail-composer
    environment:
      - TZ=UTC
      - LOG_FILE=./logs/app.log
      - LOG_MAX_SIZE_MB=50
      - LOG_MAX_BACKUPS=7
      - LOG_MAX_AGE_DAYS=14
      - LOG_COMPRESS=true
      - LOG_LEVEL=debug
      - LOG_CONSOLE=false
      - RB_HOST=<your-rabbitmq-host>
      - RB_USERNAME=<your-rabbitmq-username>
      - RB_PASSWD=<your-rabbitmq-password>
      - RB_PORT=5672
      - RB_VHOST=<your-vhost>
      - RB_MAIN_QUEUE=send_email
      - RB_DEAD_QUEUE=dead_emails
      - RB_CONSUME_PREFETCH=5
      - RB_WORKER_COUNT=2
      - RB_PREFETCH=1
      - RB_CONSUMER_TAG=emails-consumer-1
      - AMQPR_CON_DELAY=5s
    volumes:
      - ./logs:/app/logs
    restart: always
```

There's no exposed port — this service only consumes from RabbitMQ, it doesn't serve
anything over HTTP. The `./logs` volume is where the rotating log file lands; mount it
if you want logs to survive a container restart.

Run more than one replica for throughput if needed — give each a distinct
`RB_CONSUMER_TAG` and they'll share the queue via RabbitMQ's normal competing-consumers
behavior, same as scaling `RB_WORKER_COUNT` but across processes/hosts instead of
goroutines.
