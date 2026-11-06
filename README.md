# Student Task Management API

A REST API for managing student tasks, built with Java 21 and Spring Boot 3.4.

## Features

- Create, read, update, and delete tasks
- Task validation with useful client error responses
- Task statuses: `TODO`, `IN_PROGRESS`, and `COMPLETED`
- Consistent `404 Not Found` handling for missing tasks
- Application health information endpoint
- In-memory H2 database for local development
- JaCoCo XML coverage reporting

## Technology stack

- Java 21
- Spring Boot 3.4
- Spring Web
- Spring Data JPA
- Spring Boot Validation
- Spring Boot Actuator
- H2 Database
- Maven Wrapper
- JUnit 5 and Mockito
- JaCoCo

## Prerequisites

- JDK 21
- No globally installed Maven is required; the included Maven Wrapper downloads the configured Maven version.

Check the selected Java version:

```bash
java -version
```

## Project setup

Clone the repository and change into the project directory:

```bash
git clone <repository-url>
cd taskmanager
```

The application uses an in-memory H2 database and does not require credentials or external services for local development. Configuration is in [`src/main/resources/application.properties`](src/main/resources/application.properties).

## Build and run

Build the application:

```bash
./mvnw clean package
```

Run the application with Spring Boot:

```bash
./mvnw spring-boot:run
```

The API starts at `http://localhost:8080`.

On Windows, use `mvnw.cmd` instead of `./mvnw`.

## Testing and coverage

Run the unit tests:

```bash
./mvnw test
```

Run the full verification lifecycle, including the JaCoCo coverage check:

```bash
./mvnw verify
```

JaCoCo generates the XML report at `target/site/jacoco/jacoco.xml`. The `target/` directory and all generated build output are excluded from Git.

## GitHub Actions, Docker, GHCR, and GKE

The [CI workflow](.github/workflows/ci.yml) runs `./mvnw -B verify` on every push and pull request. On a push to `main`, the Docker image is built and published to GitHub Container Registry (GHCR), then deployed to Google Kubernetes Engine (GKE). Publishing requires the build-and-test job to pass, and deployment requires the image-publish job to pass.

The image definition is in [`Dockerfile`](Dockerfile), and Kubernetes resources are in [`k8s/`](k8s/). The workflow uses the GitHub-provided `GITHUB_TOKEN` for GHCR and Google Workload Identity Federation for GKE; no long-lived cloud credentials are stored in the repository.

Configure these repository settings before enabling GKE deployment:

- Secret `GCP_WORKLOAD_IDENTITY_PROVIDER`: the full Google Workload Identity Provider resource name
- Secret `GCP_SERVICE_ACCOUNT`: the Google service account used by GitHub Actions
- Variable `GCP_PROJECT_ID`: Google Cloud project ID
- Variable `GKE_CLUSTER_NAME`: GKE cluster name
- Variable `GKE_LOCATION`: GKE region or zone

The Google service account needs permission to obtain GKE credentials and deploy to the target cluster. Protect `main` and require the build workflow status check before merging.

## GitLens demonstration

GitLens is a developer-side Visual Studio Code extension, not a GitHub Actions job. Install **GitLens — Git supercharged** from the VS Code Extensions view, then open this repository.

Use the GitLens views and commands to demonstrate:

1. **Commit history:** Open the GitLens Source Control view and expand **Commits**, or run `GitLens: Show Commit Graph` from the Command Palette.
2. **Git blame:** Open a tracked file, right-click in the editor, and choose **GitLens: Toggle File Blame**. Hover a blame annotation to see the responsible commit and author.
3. **File history:** Right-click a file in Explorer or Source Control and choose **GitLens: Open File History**.
4. **Commit comparisons:** Open the commit graph, select a commit, and compare it with its parent or another selected commit. You can also use **GitLens: Compare References**.
5. **Branch visualization:** Use the commit graph to show local and remote branches, merge points, and the current branch. The Source Control view also shows branch status and changes.

Useful terminal commands for the same demonstration are:

```bash
git log --oneline --graph --decorate --all
git blame src/main/java/com/example/taskmanager/service/TaskService.java
git log --follow -- README.md
git diff main..feature/gitlens-demo
git branch --all --verbose
```

## API endpoints

| Method | Endpoint | Description | Success |
|---|---|---|---|
| `GET` | `/api/tasks` | List all tasks | `200 OK` |
| `GET` | `/api/tasks/{id}` | Get one task | `200 OK` |
| `POST` | `/api/tasks` | Create a task | `201 Created` |
| `PUT` | `/api/tasks/{id}` | Replace editable task fields | `200 OK` |
| `DELETE` | `/api/tasks/{id}` | Delete a task | `204 No Content` |
| `GET` | `/api/health` | Get application health information | `200 OK` |

### Task request

`title` is required and must be at most 200 characters. `description` is optional and may be up to 2,000 characters. `status` defaults to `TODO`.

```json
{
  "title": "Complete Java assignment",
  "description": "Review collections and streams",
  "status": "TODO"
}
```

Example request:

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Complete Java assignment","description":"Review collections and streams","status":"TODO"}'
```

Example health response:

```json
{
  "application": "taskmanager",
  "version": "0.0.1-SNAPSHOT",
  "status": "UP"
}
```

Invalid input returns `400 Bad Request`; a task ID that does not exist returns `404 Not Found`.

## Repository hygiene

The root [`.gitignore`](.gitignore) excludes Java/Maven build output, IDE metadata, local environment files, credentials, certificates, private keys, logs, and OS files. Do not commit real credentials or secrets. Use GitHub Actions secrets, repository variables, environment variables, or an untracked local configuration file for integrations.
