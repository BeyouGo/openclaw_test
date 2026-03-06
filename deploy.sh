#!/usr/bin/env bash
set -euo pipefail

ENV_FILE=${1:-.env.prod}
COMPOSE_FILE=docker-compose.prod.yml

if [ ! -f "$ENV_FILE" ]; then
  echo "Env file $ENV_FILE introuvable. Copie .env.example et remplis les secrets." >&2
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

COMPOSE_CMD=(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE")

"${COMPOSE_CMD[@]}" build
"${COMPOSE_CMD[@]}" up -d db
sleep 5
"${COMPOSE_CMD[@]}" run --rm api npx prisma migrate deploy
"${COMPOSE_CMD[@]}" up -d

echo "Déploiement terminé. Port local sécurisé: 127.0.0.1:8443"
