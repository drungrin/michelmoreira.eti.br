// All Phase 3 content collections in one place: resume, uses, now are
// single-entry-per-locale collections (one Markdown file per language);
// portfolioPt/portfolioEn are real lists sharing one schema, paired across
// locales by translationKey (never by slug/id — see ARCHITECTURE.md
// Anti-Pattern 2). Collections whose content directory isn't populated yet
// (resume, now, portfolio) resolve to an empty list at build; only the
// /uses pages in this plan call getEntry against a populated collection.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const resumeSchema = z.object({
  name: z.string(),
  title: z.string(),
  updatedDate: z.coerce.date(),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      period: z.string(),
      // Optional scope note rendered muted under the period — used to frame
      // an own-company entry so it doesn't read as a concurrent full-time job.
      note: z.string().optional(),
      achievements: z.array(z.string()),
    }),
  ),
  skills: z.object({
    // Curated, grouped core stack; historical is a muted "also worked with"
    // line; languages is spoken-language proficiency.
    core: z.array(
      z.object({
        label: z.string(),
        items: z.array(z.string()),
      }),
    ),
    historical: z.array(z.string()),
    languages: z.array(z.string()),
  }),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.string(),
    }),
  ),
});

const resume = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/resume" }),
  schema: resumeSchema,
});

// /uses: content is the annotated setup list itself, no structured
// frontmatter fields required beyond the body Markdown.
const uses = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/uses" }),
  schema: z.object({}),
});

const nowSchema = z.object({ updatedDate: z.coerce.date() });
const now = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/now" }),
  schema: nowSchema,
});

// Portfolio: two collections sharing one schema (D-07). translationKey is
// how a case resolves its cross-locale counterpart, not the file slug.
const caseSchema = z.object({
  title: z.string(),
  translationKey: z.string(),
  period: z.string(),
  stack: z.array(z.string()),
  order: z.number(),
  summary: z.string(),
});

const portfolioPt = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/portfolio/pt" }),
  schema: caseSchema,
});

const portfolioEn = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/portfolio/en" }),
  schema: caseSchema,
});

export const collections = { resume, uses, now, portfolioPt, portfolioEn };
