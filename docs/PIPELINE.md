# Pipeline

The workflow is [`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml).

## Jobs

1. **Build, test, and measure coverage** checks out the source, installs Java 21, runs `./mvnw -B clean verify`, and uploads Surefire and JaCoCo reports.
2. **Build Docker image** runs after tests pass on pushes and pull requests. It verifies the Dockerfile can produce the image tagged with the full commit SHA.
3. **Publish Docker image to GHCR** runs only on pushes to `main` and requires the image-build job. It uses `GITHUB_TOKEN` with `packages: write` and publishes the immutable commit-SHA tag.

There are no cloud deployment jobs. GitHub-hosted runners cannot deploy automatically to a developer's Mac. To deploy locally, the developer runs `./scripts/deploy-local.sh <commit-sha>` on macOS with Docker Desktop. A self-hosted runner would be required to automate local deployment from GitHub Actions.

## Finding the image tag

Open the successful workflow run for a commit in the repository's **Actions** tab. Confirm the **Publish Docker image to GHCR** job passed, copy the full commit SHA shown for the run, and use:

```bash
./scripts/deploy-local.sh FULL_COMMIT_SHA
```
