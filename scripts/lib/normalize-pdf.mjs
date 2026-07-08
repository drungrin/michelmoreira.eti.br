// normalize-pdf.mjs — strip Chromium's per-run non-deterministic PDF fields so
// regenerating unchanged résumé content yields byte-identical output. Every
// replacement is the SAME LENGTH as what it overwrites, so the xref byte
// offsets stay valid and the PDF is not corrupted.

const zeros = (s) => "0".repeat(s.length);

export function normalizePdf(input) {
  const buf = Buffer.from(input);
  // latin1 view: string length == byte length, so length-preserving edits are exact.
  let s = buf.toString("latin1");

  // Info-dict dates: /CreationDate (D:2026...+00'00') and /ModDate (...).
  s = s.replace(
    /(\/(?:CreationDate|ModDate)\s*\(D:)([^)]*)(\))/g,
    (_, a, mid, b) => a + zeros(mid) + b,
  );

  // Trailer document id: /ID [ <hex...> <hex...> ].
  s = s.replace(
    /(\/ID\s*\[\s*<)([0-9A-Fa-f]*)(>\s*<)([0-9A-Fa-f]*)(>\s*\])/g,
    (_, a, id1, mid, id2, c) => a + zeros(id1) + mid + zeros(id2) + c,
  );

  // XMP dates/ids, when a metadata stream is present.
  s = s.replace(
    /(<(xmp:CreateDate|xmp:ModifyDate|xmpMM:InstanceID|xmpMM:DocumentID)>)([^<]*)(<\/\2>)/g,
    (_, open, _tag, mid, close) => open + zeros(mid) + close,
  );

  const out = Buffer.from(s, "latin1");
  if (out.length !== buf.length) {
    throw new Error("normalizePdf changed byte length — xref offsets would break");
  }
  return out;
}
