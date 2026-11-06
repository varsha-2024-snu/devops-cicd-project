# Setup

## Local prerequisites

- JDK 21
- Git
- Docker Desktop (optional for local container testing)
- `kubectl` (only for Kubernetes deployment)
- A Google Cloud project with billing enabled (only for GKE)

Run locally with the Maven Wrapper:

```bash
./mvnw clean verify
./mvnw spring-boot:run
curl http://localhost:8080/api/health
```

The application uses an in-memory H2 database and has no required credentials.

## GitHub configuration

The workflow requires these repository secrets:

- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`

It requires these repository variables:

- `GCP_PROJECT_ID`
- `GKE_CLUSTER`
- `GKE_LOCATION`

`GITHUB_TOKEN` is supplied by GitHub Actions for GHCR and is not manually created.

## GKE preparation

Do not run these commands without confirming the project, billing account, quota, and expected cost:

```bash
gcloud services enable container.googleapis.com iamcredentials.googleapis.com sts.googleapis.com
gcloud container clusters create-auto taskmanager --location=REGION --project=PROJECT_ID
```

Create a dedicated deployer service account and configure Workload Identity Federation according to the Google Cloud and GitHub documentation. Grant only the permissions needed to obtain GKE credentials and update the target namespace. Configure Kubernetes RBAC for the service account rather than granting cluster-admin.

The workflow deploys two replicas behind a `LoadBalancer` service and uses a rolling update.
