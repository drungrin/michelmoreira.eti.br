import { test } from "node:test";
import assert from "node:assert/strict";

import { formatDate } from "./formatDate.ts";

// Single date-formatter contract: every user-facing date (the /now timestamp
// today; future dated content reuses it) routes through formatDate(), keyed
// by HTML_LANG, never a hand-rolled locale tag.

test("formatDate: pt-BR long date contains the month name and year", () => {
  const result = formatDate(new Date("2026-07-07"), "pt");
  assert.match(result, /julho/i);
  assert.match(result, /2026/);
});

test("formatDate: en long date contains the month name and year", () => {
  const result = formatDate(new Date("2026-07-07"), "en");
  assert.match(result, /July/);
  assert.match(result, /2026/);
});

test("formatDate: same Date yields a stable, non-empty string for both locales", () => {
  const date = new Date("2026-07-07");
  const pt = formatDate(date, "pt");
  const en = formatDate(date, "en");
  assert.ok(pt.length > 0);
  assert.ok(en.length > 0);
  assert.equal(formatDate(date, "pt"), pt);
  assert.equal(formatDate(date, "en"), en);
});
