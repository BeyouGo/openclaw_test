#!/usr/bin/env bash
set -euo pipefail

ENV_FILE=${1:-.env.dev}
if [ ! -f "$ENV_FILE" ]; then
  echo "Env file $ENV_FILE introuvable." >&2
  exit 1
fi

docker compose --env-file "$ENV_FILE" -f docker-compose.dev.yml up --build
