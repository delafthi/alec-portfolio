#!/usr/bin/env bash
# Netlify ignore command: exit 0 skips the build, non-zero lets it run.
# Skips when every new commit is an automated dependency update; the weekly
# scheduled rebuild (build hook) deploys those in a single batch instead.
# Any error (bad range, git failure) exits non-zero → build proceeds.
set -euo pipefail

range="${CACHED_COMMIT_REF:-HEAD~1}..${COMMIT_REF:-HEAD}"
pattern='^(flake: update|deps: update npm packages|ci: bump)'

subjects=$(git log --format=%s "$range")

[[ -z "$subjects" ]] && exit 0 # nothing new → skip

if grep -qvE "$pattern" <<< "$subjects"; then
  exit 1 # non-automated commit in range → build
fi
exit 0 # only automated updates (or nothing new) → skip
