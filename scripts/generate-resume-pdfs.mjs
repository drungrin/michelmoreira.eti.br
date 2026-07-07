#!/usr/bin/env node
//
// generate-resume-pdfs.mjs — prints the built resume pages to per-locale PDFs.
//
// Assumes a preview server is already serving the production build (dist/) on
// http://localhost:4321 — the caller (local dry-run or the CI workflow) starts
// `astro preview` and waits for the port before running this script. Printing
// from the built preview matters: an unbuilt dev server serves unminified,
// unbundled assets with different font-loading timing than production, so the
// PDF would drift from what recruiters actually download from the live page.
//
// Usage: node scripts/generate-resume-pdfs.mjs

import { chromium } from "playwright";

const pages = [
  {
    url: "http://localhost:4321/curriculo",
    out: "public/michel-moreira-cv-pt.pdf",
  },
  {
    url: "http://localhost:4321/en/resume",
    out: "public/michel-moreira-cv-en.pdf",
  },
];

const browser = await chromium.launch();
for (const { url, out } of pages) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.pdf({
    path: out,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true, // lets the resume page's @page { size: A4 } rule win
  });
  await page.close();
  console.log(`wrote ${out}`);
}
await browser.close();
