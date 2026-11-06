# Architecture

```mermaid
flowchart LR
    Developer --> GitHub
    GitHub --> Actions[GitHub Actions]
    Actions --> Maven[Maven build and JUnit 5]
    Actions --> GHCR[GHCR image tagged with commit SHA]
    Developer --> GitLens[GitLens in VS Code]
    Developer --> DockerDesktop[Docker Desktop on macOS]
    GHCR --> Compose[Docker Compose]
    Compose --> Container[taskmanager-local]
    Container --> API[REST API on localhost:8080]
    Container --> H2[(In-memory H2)]
```

The application uses controller, service, repository, entity, and exception-handler layers. GitHub-hosted Actions runners build and publish images; they do not control the developer's Mac. The local deployment script runs Compose on Docker Desktop and verifies the health endpoint.
