#!/bin/bash

set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-ghcr.io/varsha-2024-snu/devops-cicd-project}"
IMAGE_TAG="${1:-${IMAGE_TAG:-latest}}"
export IMAGE_NAME IMAGE_TAG

echo "Pulling ${IMAGE_NAME}:${IMAGE_TAG}"
docker compose pull taskmanager
docker compose up --detach --force-recreate taskmanager

echo "Waiting for http://localhost:8080/api/health"
attempt=1
while [ "$attempt" -le 30 ]; do
  if curl --fail --silent --show-error --max-time 5 http://localhost:8080/api/health; then
    printf '\nLocal deployment is healthy: %s:%s\n' "$IMAGE_NAME" "$IMAGE_TAG"
    exit 0
  fi
  attempt=$((attempt + 1))
  sleep 2
done

echo "Local deployment did not become healthy." >&2
docker compose ps
docker compose logs --tail=80 taskmanager
exit 1
