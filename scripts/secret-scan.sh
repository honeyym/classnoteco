#!/usr/bin/env sh
# Secret scan (gitleaks + ggshield) for pre-commit and CI parity.
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

run_ggshield() {
  if command -v ggshield >/dev/null 2>&1; then
    # Run when configured; skip without failing if auth missing (exit 3)
    ggshield secret scan pre-commit 2>/dev/null
    code=$?
    [ "$code" = "0" ] && return 0
    [ "$code" = "3" ] && return 0   # auth not configured, skip
    exit "$code"                     # exit 1 = secrets found
  fi
}

run_gitleaks
run_ggshield
