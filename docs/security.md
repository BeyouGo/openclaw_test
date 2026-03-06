# Security Notes

- Host-level firewall handled upstream (NAT/firewall). SSH (22/tcp) must remain reachable.
- Local credentials directory `/home/ubuntu/.openclaw/credentials` hardened to mode `700`.
- Application services will bind to `127.0.0.1` only; access requires SSH tunnel or future reverse proxy with TLS once a domain is attached.
- Admin portal protected by:
  - HTTP Basic Auth at the reverse proxy (hashed secrets stored via environment variables).
  - Application-level login (email + Argon2 password hash) issuing short-lived JWTs.
- Secrets are provided via `.env` files that stay outside the repository. Use `.env.example` as a reference template.
