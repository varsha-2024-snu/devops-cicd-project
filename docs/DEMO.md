# Viva demonstration

1. Start the API with `./mvnw spring-boot:run`.
2. Show `GET /api/health` and create a task with the documented `curl` request.
3. Run `./mvnw clean verify` and open `target/site/jacoco/index.html`.
4. Show the layered source structure and validation/exception handling.
5. Build locally with `docker build -t taskmanager:local .` when Docker Desktop is running.
6. Explain the `build-and-test -> publish-image -> deploy-to-gke -> verify-deployment` dependency chain in the Actions workflow.
7. Open GitLens in VS Code and show the commit graph, commit details, file history, and blame annotations.
8. Create a demonstration branch with `git switch -c feature/demo-change`, make a small documented change, and compare it with `main`.
9. If cloud resources are approved and configured, push to `main`, show the SHA-tagged GHCR image, rollout status, service endpoint, and `/api/health`.
10. Use the screenshots checklist below only after capturing real screenshots.

## Screenshots checklist

- [ ] API health response
- [ ] Passing Maven test and JaCoCo report
- [ ] Docker image build
- [ ] GitHub Actions job dependency chain
- [ ] GHCR image tagged with commit SHA
- [ ] GKE pods and LoadBalancer service
- [ ] GitLens commit graph
- [ ] GitLens blame and file history
