import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizePdf } from "./normalize-pdf.mjs";

const sample = Buffer.from(
  "%PDF-1.4\n" +
    "/CreationDate (D:20260708120000+00'00')\n" +
    "/ModDate (D:20260708120001+00'00')\n" +
    "trailer\n<< /ID [<0123456789ABCDEF0123456789ABCDEF> " +
    "<FEDCBA9876543210FEDCBA9876543210>] >>\n",
  "latin1",
);

test("zeroes per-run dates and id, preserving byte length", () => {
  const out = normalizePdf(sample);
  assert.equal(out.length, sample.length);
  const s = out.toString("latin1");
  assert.ok(!s.includes("20260708120000"));
  assert.ok(!s.includes("0123456789ABCDEF"));
});

test("is deterministic and idempotent", () => {
  assert.deepEqual(normalizePdf(sample), normalizePdf(sample));
  assert.deepEqual(normalizePdf(normalizePdf(sample)), normalizePdf(sample));
});
