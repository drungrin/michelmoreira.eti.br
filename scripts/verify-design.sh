#!/usr/bin/env bash
#
# verify-design.sh — design-system gate for the built output.
#
# Asserts the theming contract against dist/ plus source hygiene under src/:
#   1. A pre-paint theme script (reads localStorage) is inlined before </head>
#      on both home pages, so the .dark class is applied before first paint.
#   2. Fonts are self-hosted: @font-face CSS is emitted and .woff2 files ship
#      with the build.
#   3. Semantic color tokens are defined for light AND dark themes in the
#      built CSS and reach usage sites as var() references, so the theme can
#      flip at runtime without rebuilding styles.
#   4. Markup uses only the semantic utilities generated from the token
#      namespace — raw palette utilities are forbidden under src/.
#
# Runs from the repo root, takes no arguments, and performs NO build itself.
#
# Usage: npm run build && bash scripts/verify-design.sh

set -euo pipefail

fail=0

# --- Guard: the build output must exist --------------------------------------
if [ ! -f dist/index.html ] || [ ! -f dist/en.html ]; then
  echo "FAIL  dist/index.html and/or dist/en.html missing." >&2
  echo "      Run the build first:  npm run build" >&2
  exit 2
fi

# --- 1. Pre-paint theme script before </head> --------------------------------
# Split each page on the closing head tag (awk record separator) and inspect
# only the first record, so the check works on minified single-line HTML.
for page in dist/index.html dist/en.html; do
  head_content="$(awk 'BEGIN { RS="</head>" } NR == 1 { print; exit }' "$page")"
  if printf '%s' "$head_content" | grep -q 'localStorage'; then
    echo "PASS  ${page}: pre-paint theme script found before </head>"
  else
    echo "FAIL  ${page}: no localStorage access before </head> (theme must resolve pre-paint)" >&2
    fail=1
  fi
done

# --- 2. Font pipeline: @font-face emitted + .woff2 files served --------------
if grep -q '@font-face' dist/index.html; then
  echo "PASS  dist/index.html: @font-face emitted"
else
  echo "FAIL  dist/index.html: no @font-face found (self-hosted font CSS missing)" >&2
  fail=1
fi

woff2_count="$(find dist/_astro/fonts -name '*.woff2' 2>/dev/null | wc -l || true)"
if [ "$woff2_count" -ge 2 ]; then
  echo "PASS  dist/_astro/fonts: ${woff2_count} .woff2 file(s) served"
else
  echo "FAIL  dist/_astro/fonts: expected at least 2 .woff2 files, found ${woff2_count}" >&2
  fail=1
fi

# --- 3. Token flip in the built stylesheet(s) ---------------------------------
css_found=0
for f in dist/_astro/*.css; do
  [ -e "$f" ] && css_found=1
  break
done

if [ "$css_found" -ne 1 ]; then
  echo "FAIL  dist/_astro: no built stylesheet found" >&2
  fail=1
else
  if grep -q '\.dark' dist/_astro/*.css; then
    echo "PASS  built CSS: .dark selector present"
  else
    echo "FAIL  built CSS: no .dark selector (dark theme definitions missing)" >&2
    fail=1
  fi

  surface_defs="$(grep -o -- '--surface:' dist/_astro/*.css | wc -l || true)"
  if [ "$surface_defs" -ge 2 ]; then
    echo "PASS  built CSS: --surface defined ${surface_defs} times (light + dark values)"
  else
    echo "FAIL  built CSS: --surface defined ${surface_defs} time(s), expected >= 2 (light + dark)" >&2
    fail=1
  fi

  if grep -q 'var(--surface' dist/_astro/*.css; then
    echo "PASS  built CSS: utilities carry var(--surface…) references (runtime-flippable)"
  else
    echo "FAIL  built CSS: no var(--surface…) reference (tokens not reaching a usage site)" >&2
    fail=1
  fi
fi

# --- 4. Semantic-utilities-only markup ----------------------------------------
raw_palette="$(grep -rnE '(text|bg|border|ring)-(slate|blue)-[0-9]' src/ 2>/dev/null || true)"
if [ -z "$raw_palette" ]; then
  echo "PASS  src/: no raw palette utilities (semantic token utilities only)"
else
  echo "FAIL  src/: raw palette utilities found — use the semantic token utilities instead:" >&2
  printf '%s\n' "$raw_palette" >&2
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  echo "" >&2
  echo "verify-design: FAILED — the design contract is not satisfied by the built output" >&2
  exit 1
fi

echo ""
echo "verify-design: PASSED — theme script, fonts, token flip, and semantic-only markup all green"
