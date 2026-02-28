#!/usr/bin/env sh
# Scan the built Docker image with Trivy and Dockle.
# Requires: image exists. Build first: docker compose build (or docker build with secrets)
#
# Usage:
#   ./scripts/scan-image.sh
#   IMAGE=ghcr.io/owner/classnoteco:latest ./scripts/scan-image.sh

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# Resolve image: env IMAGE, or latest classnoteco image, or docker compose image
IMAGE="${IMAGE:-}"
if [ -z "$IMAGE" ]; then
  IMAGE="$(docker images --format '{{.Repository}}:{{.Tag}}' | grep -E 'classnoteco|classnoteco-app' | head -1)"
fi
if [ -z "$IMAGE" ]; then
  echo "Error: No image found. Build first:"
  echo "  docker compose build   # or: DOCKER_BUILDKIT=1 docker build -t ghcr.io/owner/classnoteco:dev ."
  echo ""
  echo "If Trivy reports Go 1.22 vulns, rebuild with: docker compose build --no-cache"
  echo ""
  echo "Or set IMAGE explicitly:"
  echo "  IMAGE=ghcr.io/owner/classnoteco:dev ./scripts/scan-image.sh"
  exit 1
fi

echo "Scanning image: $IMAGE"
echo ""

if command -v trivy >/dev/null 2>&1; then
  echo "--- Trivy ---"
  trivy image "$IMAGE"
  echo ""
fi

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  echo "--- Dockle ---"
  docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
    goodwithtech/dockle:latest "$IMAGE"
fi
