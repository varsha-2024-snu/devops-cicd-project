# Pipeline

The workflow is [`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml).

## Jobs

1. **Build, test, and measure coverage** checks out the source, installs Java 21, runs `./mvnw -B clean verify`, and uploads Surefire and JaCoCo reports. A test or coverage failure stops the workflow.
2. **Build and publish Docker image** runs only on `main` pushes or manual dispatch and requires the build job. It authenticates to GHCR with the least required `packages: write` permission and publishes `ghcr.io/<owner>/<repository>:<full-commit-sha>`.
3. **Deploy exact image to GKE** requires image publishing. Workload Identity Federation authenticates without a long-lived JSON key. The workflow substitutes the exact commit image into the Deployment, applies Kubernetes resources, and waits for rollout.
4. **Verify live deployment** requires deployment. It waits up to five minutes for the LoadBalancer endpoint and checks `/api/health`.

No deploy job runs for pull requests. No credentials are hardcoded. GitLens is not a workflow job; it is used locally in VS Code to inspect the resulting Git history.

## Manual dispatch

Use the Actions tab to select **CI/CD**, choose a branch, and select **Run workflow**. Manual dispatch still requires all configured GCP secrets and variables.
