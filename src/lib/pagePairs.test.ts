import { test } from "node:test";
import assert from "node:assert/strict";

import { pagePairUrl } from "./pagePairs.ts";

// Static slug-pairing contract (D-13). Every localized-slug page link and its
// language-switcher counterpart resolve through pagePairUrl(), never a
// hand-built string. Locked here so the PT/EN slug pairs can never drift.

test('pagePairUrl: resume pt is "/curriculo"', () => {
  assert.equal(pagePairUrl("resume", "pt"), "/curriculo");
});

test('pagePairUrl: resume en is "/en/resume"', () => {
  assert.equal(pagePairUrl("resume", "en"), "/en/resume");
});

test('pagePairUrl: portfolio pt is "/portfolio"', () => {
  assert.equal(pagePairUrl("portfolio", "pt"), "/portfolio");
});

test('pagePairUrl: portfolio en is "/en/portfolio"', () => {
  assert.equal(pagePairUrl("portfolio", "en"), "/en/portfolio");
});

test('pagePairUrl: uses pt is "/uses"', () => {
  assert.equal(pagePairUrl("uses", "pt"), "/uses");
});

test('pagePairUrl: uses en is "/en/uses"', () => {
  assert.equal(pagePairUrl("uses", "en"), "/en/uses");
});

test('pagePairUrl: now pt is "/now"', () => {
  assert.equal(pagePairUrl("now", "pt"), "/now");
});

test('pagePairUrl: now en is "/en/now"', () => {
  assert.equal(pagePairUrl("now", "en"), "/en/now");
});

test("pagePairUrl: every key resolves to a non-empty, slash-prefixed, no-trailing-slash path for both locales", () => {
  const keys = ["resume", "portfolio", "uses", "now"] as const;
  const locales = ["pt", "en"] as const;
  for (const key of keys) {
    for (const locale of locales) {
      const result = pagePairUrl(key, locale);
      assert.ok(
        result.length > 0,
        `expected non-empty result for ${key}/${locale}`,
      );
      assert.ok(
        result.startsWith("/"),
        `expected leading slash for ${key}/${locale}: got "${result}"`,
      );
      assert.ok(
        !result.endsWith("/"),
        `expected no trailing slash for ${key}/${locale}: got "${result}"`,
      );
    }
  }
});
