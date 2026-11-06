# Troubleshooting

## Docker Desktop is unavailable

Start Docker Desktop and verify:

```bash
docker info
docker compose version
```

## GHCR pull fails

Confirm the image tag came from a successful **Publish Docker image to GHCR** job. For a private package, run `docker login ghcr.io` with a package-read token. Never commit that token.

## Container is unhealthy

```bash
docker compose ps
docker compose logs --tail=80 taskmanager
curl --fail http://localhost:8080/api/health
```

The application may need its configured start period before the health check passes.

## Port 8080 is already in use

Stop the process using the port or choose a different host port temporarily:

```bash
docker compose down
lsof -nP -iTCP:8080 -sTCP:LISTEN
```

## Rollback

Use a full commit SHA that was previously published successfully:

```bash
./scripts/rollback-local.sh KNOWN_GOOD_SHA
```
