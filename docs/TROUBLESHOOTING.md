# Troubleshooting

## Maven or Java version

Check `java -version`. The project requires JDK 21. Use the wrapper (`./mvnw`) rather than relying on a global Maven installation.

## Docker daemon unavailable

Start Docker Desktop and retry:

```bash
docker info
docker build -t taskmanager:local .
```

## GHCR permission denied

Confirm the workflow has `packages: write`, the package belongs to the repository, and the package visibility/access settings permit the intended GKE pull.

## GKE authentication fails

Check the provider and service account secret values, repository/branch attribute conditions, the `id-token: write` permission, and the service account IAM grants. Do not add a JSON key to the repository.

## Deployment does not roll out

```bash
kubectl get pods -l app=taskmanager
kubectl describe deployment taskmanager
kubectl describe pods -l app=taskmanager
kubectl rollout status deployment/taskmanager
```

Check that the GHCR image is available to the cluster. A private package needs an image pull secret or an appropriate node/workload identity configuration.

## LoadBalancer has no address

Wait for provisioning and inspect:

```bash
kubectl get service taskmanager --watch
kubectl describe service taskmanager
```

The workflow intentionally fails after its bounded five-minute health-check window rather than waiting forever.
