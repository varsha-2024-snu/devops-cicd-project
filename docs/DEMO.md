# Viva demonstration

1. Start Docker Desktop.
2. Run `./mvnw clean verify` and show the 12 passing tests and JaCoCo report.
3. Run `docker compose config` to show the local deployment configuration.
4. Open a successful GitHub Actions run and show the test, Docker build, and GHCR publish jobs.
5. Copy the run's full commit SHA and run `./scripts/deploy-local.sh FULL_COMMIT_SHA`.
6. Show `docker compose ps` with a healthy `taskmanager-local` container.
7. Open `http://localhost:8080/api/health`.
8. Run `./scripts/rollback-local.sh KNOWN_GOOD_SHA` and show the health check again.
9. Open GitLens in VS Code to show commit history, blame, file history, comparisons, and branches.

GitHub-hosted runners do not deploy to this Mac. The local deployment is manually initiated unless a self-hosted runner is deliberately configured.

## Screenshots checklist

- [ ] API health response
- [ ] Passing Maven test and JaCoCo report
- [ ] Docker Compose configuration
- [ ] GitHub Actions test/build/publish jobs
- [ ] GHCR image tagged with commit SHA
- [ ] Healthy local Compose container
- [ ] GitLens graph/blame/file history
