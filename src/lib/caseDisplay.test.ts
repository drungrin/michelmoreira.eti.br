import { test } from "node:test";
import assert from "node:assert/strict";

import { formatCaseNumber, sortCasesByOrder } from "./caseDisplay.ts";

// Selected Work display contract (Phase 3.1). The home "Selected Work" section
// renders the portfolio cases with a two-digit ordinal (01, 02, ...) and always
// in ascending data.order, from a NEW array so the source collection is never
// mutated. Numbering is derived from the sorted index, not a stored field, so it
// stays correct as the case count grows to 3 or 4 with no layout change.

test('formatCaseNumber: index 0 is "01"', () => {
  assert.equal(formatCaseNumber(0), "01");
});

test('formatCaseNumber: index 1 is "02"', () => {
  assert.equal(formatCaseNumber(1), "02");
});

test('formatCaseNumber: index 9 is "10" (survives growth past two cases)', () => {
  assert.equal(formatCaseNumber(9), "10");
});

test("sortCasesByOrder: sorts ascending by data.order", () => {
  const input = [
    { data: { order: 3 } },
    { data: { order: 1 } },
    { data: { order: 2 } },
  ];
  const sorted = sortCasesByOrder(input);
  assert.deepEqual(
    sorted.map((c) => c.data.order),
    [1, 2, 3],
  );
});

test("sortCasesByOrder: does not mutate its input array", () => {
  const input = [
    { data: { order: 3 } },
    { data: { order: 1 } },
    { data: { order: 2 } },
  ];
  const before = input.map((c) => c.data.order);
  const sorted = sortCasesByOrder(input);
  assert.notEqual(sorted, input); // returns a new array reference
  assert.deepEqual(
    input.map((c) => c.data.order),
    before,
  ); // original order preserved
});

test("sortCasesByOrder: result is ascending-by-order and same length for any small fixture", () => {
  const fixtures = [
    [{ data: { order: 2 } }, { data: { order: 1 } }],
    [{ data: { order: 4 } }, { data: { order: 2 } }, { data: { order: 3 } }, { data: { order: 1 } }],
  ];
  for (const input of fixtures) {
    const sorted = sortCasesByOrder(input);
    assert.equal(sorted.length, input.length);
    for (let i = 1; i < sorted.length; i++) {
      assert.ok(
        sorted[i - 1].data.order <= sorted[i].data.order,
        `expected ascending order at index ${i}`,
      );
    }
  }
});
