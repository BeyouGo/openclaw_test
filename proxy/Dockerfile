# proxy/Dockerfile
FROM node:20-alpine AS frontend-builder
WORKDIR /web
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

FROM caddy:2-alpine
WORKDIR /srv
COPY proxy/Caddyfile /etc/caddy/Caddyfile
COPY --from=frontend-builder /web/dist ./www
EXPOSE 8443
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
