// Selected Work display helpers (Phase 3.1). Exists so the case numbering and
// order-based sort are defined once instead of inlined across the now-four
// case-listing call sites (both portfolio index pages and both home pages),
// where copies would silently drift. Case numbering is derived from the sorted
// index so it stays correct as the case count grows; sorting returns a new
// array so the caller's collection is never mutated. Pure module, no astro:
// imports, runnable under node:test (same register as pagePairs.ts).

export function formatCaseNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function sortCasesByOrder<T extends { data: { order: number } }>(
  cases: T[],
): T[] {
  return [...cases].sort((a, b) => a.data.order - b.data.order);
}
