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

## Workload Identity Federation configuration

The failed deployment log will show `the GitHub Action workflow must specify exactly one of "workload_identity_provider" or "credentials_json"` when `GCP_WORKLOAD_IDENTITY_PROVIDER` is missing. The workflow now fails earlier with the exact missing secret or variable name.

Configure the GitHub repository secrets and variables exactly as follows:

```bash
gh secret set GCP_WORKLOAD_IDENTITY_PROVIDER \
  --body "projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID"
gh secret set GCP_SERVICE_ACCOUNT \
  --body "github-deployer@PROJECT_ID.iam.gserviceaccount.com"
gh variable set GCP_PROJECT_ID --body "PROJECT_ID"
gh variable set GKE_CLUSTER --body "CLUSTER_NAME"
gh variable set GKE_LOCATION --body "REGION_OR_ZONE"
```

Do not paste secret values into source files or workflow logs. Verify only that the names exist in **Repository Settings > Secrets and variables > Actions**.

The workload identity provider must trust this repository and the `main` branch (or the intended GitHub subject condition), and permit the GitHub Actions principal to impersonate the service account. The deployer service account needs the minimum Google Cloud permissions required to get credentials for the cluster and update the target Kubernetes resources. The Kubernetes identity must also have RBAC permissions to update the `taskmanager` Deployment and Service.

Before rerunning the workflow, verify locally or in an approved Google Cloud environment:

```bash
gcloud auth list
gcloud projects describe PROJECT_ID
gcloud container clusters describe CLUSTER_NAME \
  --location=REGION_OR_ZONE --project=PROJECT_ID
kubectl config current-context
kubectl auth can-i apply deployments --namespace=default
kubectl auth can-i patch deployment/taskmanager --namespace=default
```

If GHCR is private, configure a Kubernetes `imagePullSecret` or grant the cluster workload an appropriate registry-read identity. The workflow publishes the immutable `${GITHUB_SHA}` image and the deployment manifest uses that exact tag; it does not deploy `latest`.
