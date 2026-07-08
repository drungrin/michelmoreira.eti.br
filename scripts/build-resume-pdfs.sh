#!/usr/bin/env bash
# Local one-shot: build, serve the built site, print the résumé PDFs, clean up.
# Produces the exact bytes the CI 'resume-pdfs' check expects — commit the
# results in public/ on your feature branch to make that check pass.
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build
npm run preview -- --port 4321 &
PREV=$!
trap 'kill "$PREV" 2>/dev/null || true' EXIT

until curl -sf -o /dev/null http://localhost:4321/curriculo; do sleep 1; done
node scripts/generate-resume-pdfs.mjs
