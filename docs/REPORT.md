# Design and Implementation of an End-to-End Local Docker CI/CD Pipeline

## 1. Objective

This project demonstrates a Java Spring Boot Student Task Management API with automated testing, container packaging, GHCR publishing, and manually initiated local Docker deployment.

## 2. Introduction

The pipeline makes the path from a Git commit to a reproducible local container explicit without requiring paid cloud infrastructure. GitLens complements the pipeline in VS Code by making history, blame, branch relationships, and changes easy to inspect.

## 3. Tools and technologies

The implementation uses Java 21, Spring Boot 3.4, Spring Web, Spring Data JPA, Bean Validation, H2, Actuator, Maven, JUnit 5, Mockito, JaCoCo, GitHub Actions, Docker, Docker Compose, GHCR, and GitLens.

## 4. System architecture

The API uses controller, service, repository, entity, and exception-handler layers. GitHub Actions runs tests and builds the image; pushes to `main` publish the image with an immutable full-SHA tag. A macOS developer runs the Compose deployment script locally.

## 5. Implementation

`Task` contains `id`, `title`, `description`, `status`, and `createdAt`. CRUD endpoints use validation and global exception handling. `/api/health` returns the application name, version, and status. H2 is in-memory for a stateless classroom demonstration.

## 6. CI/CD workflow

Every push and pull request runs Maven verification, builds the Docker image after tests pass, and uploads reports. Only pushes to `main` publish to GHCR. GitHub-hosted runners do not deploy to a developer's Mac; local deployment is intentionally manual.

## 7. Testing and results

The unit suite covers service behavior, missing IDs, create/update/delete flows, validation boundaries, and entity defaults. JaCoCo produces XML and HTML reports. Run `./mvnw clean verify` to reproduce the result.

## 8. GitLens integration

GitLens is used in VS Code, not in GitHub Actions. Its commit graph, blame, file history, and comparison views support code review and viva discussion.

## 9. Local Docker deployment

`docker-compose.yml` runs the GHCR image on port 8080 with a health check. `scripts/deploy-local.sh` pulls a selected SHA, recreates the container, and checks `/api/health`. `scripts/rollback-local.sh` repeats that process for a known-good tag.

## 10. Conclusion and future scope

The project provides a low-cost, auditable local delivery workflow. Future work could add persistent storage, authentication, integration tests, and an explicitly approved self-hosted runner if remote automation of a local machine becomes necessary.

## Evidence placeholders

- `[Insert actual Maven test and JaCoCo screenshot]`
- `[Insert actual GitHub Actions run screenshot]`
- `[Insert actual GHCR image screenshot]`
- `[Insert actual local Docker Compose and health screenshot]`
- `[Insert actual GitLens graph/blame screenshot]`
