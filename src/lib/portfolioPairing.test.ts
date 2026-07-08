import { test } from "node:test";
import assert from "node:assert/strict";

import { portfolioCounterpartUrl } from "./portfolioPairing.ts";

// translationKey pairing contract (D-07, Pitfall 4). A case's cross-locale
// counterpart is resolved by matching translationKey against the OTHER
// locale's collection entries, never by slug/id — slugs are free to diverge
// per locale (localized titles produce different slugs).

test("portfolioCounterpartUrl: returns the counterpart slug's URL when translationKey matches", () => {
  const enEntries = [
    { translationKey: "case-one", slug: "case-one" },
    { translationKey: "case-two", slug: "case-two" },
  ];
  assert.equal(
    portfolioCounterpartUrl(enEntries, "case-one", "en"),
    "/en/portfolio/case-one",
  );
});

test("portfolioCounterpartUrl: pairs correctly even when slugs diverge per locale", () => {
  const enEntries = [
    { translationKey: "low-code-platform", slug: "low-code-platform" },
  ];
  // pt source slug would be "plataforma-low-code", but matching is by
  // translationKey, not slug, so the divergent en slug still resolves.
  assert.equal(
    portfolioCounterpartUrl(enEntries, "low-code-platform", "en"),
    "/en/portfolio/low-code-platform",
  );
});

test("portfolioCounterpartUrl: builds the pt counterpart URL via localeUrl", () => {
  const ptEntries = [
    { translationKey: "case-one", slug: "caso-um" },
    { translationKey: "case-two", slug: "caso-dois" },
  ];
  assert.equal(
    portfolioCounterpartUrl(ptEntries, "case-two", "pt"),
    "/portfolio/caso-dois",
  );
});

test("portfolioCounterpartUrl: returns undefined when no counterpart matches (caller falls back to locale home)", () => {
  const enEntries = [{ translationKey: "case-one", slug: "case-one" }];
  assert.equal(
    portfolioCounterpartUrl(enEntries, "case-missing", "en"),
    undefined,
  );
});
