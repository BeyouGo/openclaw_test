# OpenClaw Secure Portal

Portail privé pour Mehdi, utilisé comme espace d’échange avec l’agent OpenClaw. L’objectif est d’avoir une stack entièrement conteneurisée (backend Fastify + Postgres + reverse proxy Caddy servant un frontend Vue 3), avec séparation claire dev/prod et accès restreint.

## Stack

- **Backend** : Fastify (Node 20, TypeScript) + Prisma + Postgres
- **Frontend** : Vue 3 + Vite + TypeScript
- **Reverse proxy** : Caddy (Basic Auth + routage `/api` → backend + fichiers statiques)
- **Conteneurs** : Docker Compose (`docker-compose.dev.yml` et `docker-compose.prod.yml`)

## Prérequis

- Node.js ≥ 20 (pour développement local)
- Docker + Docker Compose plugin (pour dev/prod conteneurisés)
- Accès SSH au serveur (pour créer un tunnel vers `127.0.0.1:8443` tant que le domaine/TLS n’est pas connecté)

## Configuration

1. Duplique `.env.example` → `.env.dev` (pour le dev) et `.env.prod` (prod). Change `SESSION_SECRET`, `POSTGRES_PASSWORD`, etc.
2. Mets à jour `ADMIN_PASSWORD_HASH` avec `npm run hash-password -- <motdepasse>` (script à venir) ou via `node -e` + `argon2`.
3. Le reverse proxy utilise `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD_HASH` (même hash Argon2 accepté).

## Développement

```bash
cp .env.example .env.dev  # puis édite les secrets
./scripts/dev-up.sh       # (à écrire) ou `docker compose -f docker-compose.dev.yml --env-file .env.dev up`
```

Services exposés en dev :
- API : http://localhost:4000
- Frontend : http://localhost:5173
- Postgres : localhost:5432

## Production

```bash
cp .env.example .env.prod
./deploy.sh .env.prod
# Accès via tunnel SSH → http://127.0.0.1:8443 (Basic Auth + login applicatif)
```

Le script :
1. Construit les images.
2. Lève Postgres + applique les migrations Prisma.
3. Démarre les services `api`, `proxy`.

## Sécurité

- Caddy applique Basic Auth (hash Argon2) et n’écoute que sur `127.0.0.1:8443` (accès via tunnel uniquement).
- L’application requiert une seconde authentification (email + mot de passe) et génère des JWT d’une heure.
- Les secrets restent en dehors du dépôt (`.env*`).
- Les interactions sont stockées dans Postgres via Prisma.

Voir `docs/security.md` et `docs/task-log.md` pour le détail des actions.
