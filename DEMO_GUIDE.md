# Task Manager Demo Guide

## Project overview

TaskFlow is a responsive task-management dashboard backed by a Java 21 Spring Boot REST API. It supports live task creation, editing, deletion, search, status filtering, and dynamically calculated statistics.

## Architecture and technologies

- **Frontend:** HTML5, CSS3, and vanilla JavaScript served from Spring Boot static resources.
- **Backend:** Spring Boot 3.4, Java 21, Spring MVC, Bean Validation, Spring Data JPA.
- **Persistence:** H2 in-memory database for the current application runtime.
- **Delivery:** Multi-stage Docker build, GitHub Container Registry, and Azure Container Apps.
- **API:** `/api/tasks` for CRUD and `/api/health` for deployment health/version.

## CI/CD pipeline

Every push to `main` runs `./mvnw -B clean verify`, builds the Docker image, publishes it to GHCR, updates the existing Azure Container App, and polls `/api/health` until the deployment is ready. Pull requests run the build and test job without deploying.

## Run locally

```bash
./mvnw spring-boot:run
```

Open [http://localhost:8080/](http://localhost:8080/). The API can also be exercised directly at `/api/tasks` and `/api/health`.

## Live URL

https://taskmanager-app.salmonglacier-675bb70f.eastasia.azurecontainerapps.io/

## Two-minute evaluator demonstration

1. Open the live URL and point out the Azure deployment indicator, API health pill, and Java 21 project branding.
2. Click **Load demo tasks** to populate four realistic tasks through the real POST API.
3. Highlight the live summary cards and filter the list to **In progress**.
4. Search for “pipeline” to demonstrate client-side search over API-loaded data.
5. Edit a task, change its status, save it, and show that the statistics update.
6. Create a new task with a title and description, then delete it with confirmation.
7. Mention that the GitHub Actions workflow tests, packages, publishes, deploys, and verifies health automatically.

## Evidence checklist

- [ ] Dashboard loads at `/` from the Spring Boot application.
- [ ] API health shows `API connected` and an application version.
- [ ] Demo data was added through `POST /api/tasks`.
- [ ] Statistics, search, and status filters reflect live API data.
- [ ] Edit uses `PUT /api/tasks/{id}` and delete uses `DELETE /api/tasks/{id}`.
- [ ] GitHub Actions build/test and deployment jobs succeeded.
