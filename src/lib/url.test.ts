import { test } from "node:test";
import assert from "node:assert/strict";

import { localeUrl } from "./url.ts";

// The no-trailing-slash contract. Every internal link, the language switcher,
// and future hreflang/sitemap emitters route through localeUrl(). Locked here
// so the canonical `/en` (no trailing slash) can never drift.

test('localeUrl: pt home is exactly "/"', () => {
  assert.equal(localeUrl("pt"), "/");
});

test('localeUrl: en home is "/en" with NO trailing slash', () => {
  assert.equal(localeUrl("en"), "/en");
});

test('localeUrl: pt sub-path is "/blog"', () => {
  assert.equal(localeUrl("pt", "blog"), "/blog");
});

test('localeUrl: en sub-path is "/en/blog"', () => {
  assert.equal(localeUrl("en", "blog"), "/en/blog");
});

test("localeUrl: strips leading/trailing slashes in the path arg idempotently", () => {
  assert.equal(localeUrl("pt", "/blog/"), "/blog");
  assert.equal(localeUrl("en", "/blog/"), "/en/blog");
  assert.equal(localeUrl("pt", "/blog"), "/blog");
  assert.equal(localeUrl("en", "blog/"), "/en/blog");
});

test("localeUrl: no return value ends in a trailing slash except the bare pt root", () => {
  const cases: Array<[Parameters<typeof localeUrl>[0], string | undefined]> = [
    ["pt", undefined],
    ["en", undefined],
    ["pt", "blog"],
    ["en", "blog"],
    ["pt", "/blog/"],
    ["en", "/blog/"],
  ];
  for (const [locale, path] of cases) {
    const result =
      path === undefined ? localeUrl(locale) : localeUrl(locale, path);
    if (result === "/") continue; // the one allowed trailing slash: bare pt root
    assert.ok(
      !result.endsWith("/"),
      `expected no trailing slash: got "${result}"`,
    );
  }
});
