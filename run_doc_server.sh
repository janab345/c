#!/usr/bin/env bash
PORT=${1:-8080}
echo "=========================================================="
echo "  🚀 NASA cFS C Learning Documentation Site"
echo "  Open in browser: http://localhost:${PORT}"
echo "  Or file directly: file://$(realpath "$(dirname "$0")/docs/index.html")"
echo "  Press Ctrl+C to stop the server."
echo "=========================================================="
python3 -m http.server "$PORT" --directory "$(dirname "$0")/docs"
