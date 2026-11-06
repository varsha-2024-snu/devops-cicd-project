# Design and Implementation of an End-to-End Cloud-Based CI/CD Pipeline

## 1. Objective

This project demonstrates an end-to-end delivery path for a Java Spring Boot Student Task Management API. The objective is to connect maintainable application code, automated testing, container packaging, registry publishing, and Kubernetes deployment while keeping cloud credentials out of source control.

## 2. Introduction

Manual build and deployment processes are slow and difficult to reproduce. This project uses Maven and GitHub Actions to make the path from a Git commit to a running GKE workload explicit and repeatable. GitLens complements the pipeline on the developer workstation by making history, blame, branch relationships, and changes easy to inspect.

## 3. Tools and technologies

The implementation uses Java 21, Spring Boot 3.4, Spring Web, Spring Data JPA, Bean Validation, H2, Actuator, Maven, JUnit 5, Mockito, JaCoCo, GitHub Actions, Docker, GHCR, Kubernetes, and GKE. Google Workload Identity Federation is used instead of long-lived service-account keys.

## 4. System architecture

The API uses controller, service, repository, entity, and exception-handler layers. A Deployment runs two replicas, exposes port 8080, and is fronted by a LoadBalancer Service. Readiness and liveness probes call the health endpoint. H2 is in-memory and therefore suitable for a stateless demonstration rather than durable production storage.

## 5. Implementation

`Task` contains `id`, `title`, `description`, `status`, and `createdAt`. The REST controller exposes CRUD operations under `/api/tasks`; validation rejects blank or oversized input, and the global handler maps missing records to 404 and invalid requests to 400. `/api/health` returns the application name, version, and status.

## 6. CI/CD workflow

Every push and pull request runs Maven verification and uploads test and JaCoCo artifacts. Only a push to `main` or an explicit manual dispatch can publish an image or deploy. The image is tagged with the complete Git SHA, preventing deployment ambiguity. Job dependencies ensure a failed test cannot reach GHCR or GKE.

## 7. Testing and results

The unit suite covers service behavior, missing IDs, create/update/delete flows, validation boundaries, and entity defaults. JaCoCo produces XML and HTML reports and enforces a minimum bundle line coverage. Run `./mvnw clean verify` to reproduce the result. Actual test output and screenshots should be attached to the final academic submission after execution.

## 8. GitLens integration

GitLens is used in VS Code, not in GitHub Actions. The commit graph demonstrates meaningful feature work; blame explains line ownership; file history and comparisons connect code changes to commits. These views support review and viva discussion without inventing CI functionality for a developer extension.

## 9. Kubernetes deployment

The Deployment uses two replicas, rolling updates, resource requests/limits, non-root security settings, and health probes. The workflow substitutes the immutable SHA image before applying the manifest, waits for rollout, then checks the external health endpoint.

## 10. Conclusion and future scope

The project establishes a compact, auditable delivery pipeline. Future work could add a persistent database, API authentication, integration tests, progressive delivery, observability, and policy-as-code. Any such additions should preserve least privilege and avoid committing secrets.

## Evidence placeholders

- `[Insert actual Maven test and JaCoCo screenshot]`
- `[Insert actual GitHub Actions run screenshot]`
- `[Insert actual GHCR image screenshot]`
- `[Insert actual GKE rollout and service screenshot]`
- `[Insert actual GitLens graph/blame screenshot]`
