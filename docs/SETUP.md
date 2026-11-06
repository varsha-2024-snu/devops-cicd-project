# Setup

## Prerequisites

- JDK 21
- Git
- Docker Desktop for macOS
- VS Code with GitLens (optional)

Only local development tools are required; no paid infrastructure or cloud credentials are needed.

## Local application

```bash
./mvnw clean verify
./mvnw spring-boot:run
curl http://localhost:8080/api/health
```

## Local Docker deployment

Build and run the image locally:

```bash
docker build --tag taskmanager:local .
docker run --rm --publish 8080:8080 taskmanager:local
```

Or deploy a GHCR image with Compose:

```bash
./scripts/deploy-local.sh COMMIT_SHA
```

The script requires Docker Desktop to be running, pulls `ghcr.io/varsha-2024-snu/devops-cicd-project:COMMIT_SHA`, recreates the Compose service, and verifies `/api/health`. `IMAGE_NAME` and `IMAGE_TAG` can be overridden for another GHCR owner or tag.

## GHCR authentication

For a private package, authenticate on the Mac using a GitHub token with package-read permission:

```bash
docker login ghcr.io
```

Do not store the token in this repository. A public package can be pulled without authentication.
