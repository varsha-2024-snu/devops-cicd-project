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

The root [`.gitignore`](.gitignore) excludes Java/Maven build output, IDE metadata, local environment files, credentials, certificates, private keys, logs, and OS files. Do not commit real credentials or secrets. Use environment variables or an untracked local configuration file for any future secret-backed integration.
