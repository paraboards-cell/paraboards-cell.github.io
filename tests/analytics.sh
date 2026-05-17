#!/usr/bin/env bash
# Verifies Plausible Analytics is present in every page HTML file.
# Usage: bash tests/analytics.sh

SITE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXPECTED_DOMAIN="paraboards.com"
EXPECTED_SRC="https://plausible.io/js/script.js"
PASS=0
FAIL=0

while IFS= read -r -d '' file; do
  # Skip build output
  [[ "$file" == *"/build/"* ]] && continue

  if grep -q "data-domain=\"$EXPECTED_DOMAIN\"" "$file" && \
     grep -q "src=\"$EXPECTED_SRC\"" "$file"; then
    echo "PASS  ${file#$SITE_ROOT/}"
    ((PASS++))
  else
    echo "FAIL  ${file#$SITE_ROOT/}  — Plausible snippet missing or wrong domain"
    ((FAIL++))
  fi
done < <(find "$SITE_ROOT" -name "*.html" -print0)

echo ""
echo "Results: $PASS passed, $FAIL failed"
[[ $FAIL -eq 0 ]]
