#!/usr/bin/env sh
# Secret scan (gitleaks) for pre-commit and CI parity.
# Blocks commit if secrets are found. Uses Docker or native gitleaks.

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

run_gitleaks() {
  if command -v gitleaks >/dev/null 2>&1; then
    gitleaks protect --no-banner --verbose
    return
  fi
  if command -v docker >/dev/null 2>&1; then
    if ! docker info >/dev/null 2>&1; then
      echo "Error: Docker is installed but not running. Start Docker, or install gitleaks: brew install gitleaks"
      exit 1
    fi
    docker run --rm -v "${REPO_ROOT}:/repo" -w /repo ghcr.io/gitleaks/gitleaks:latest protect --no-banner --verbose
    return
  fi
  echo "Error: Install gitleaks (brew install gitleaks) or Docker to scan for secrets."
  echo "CI will still scan on push; install locally to catch secrets before committing."
  exit 1
}

run_gitleaks
