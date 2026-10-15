# PLAN — Nasser Military High School

Product roadmap for the digital learning platform of مدرسة ناصر الثانوية العسكرية بأسيوط.
Each milestone is small enough to ship on its own and leaves the site in a working state.
The site keeps working throughout: if a later service (AI, sync, Google) is down or not yet
configured, the grade pages, library, and search stay available.

Guiding rules for every milestone:

- No invented official information. Anything that isn't verified is labeled as such.
- The Egyptian Ministry of Education website (moe.gov.eg) is the most important source.
- Certificate years come first: الثاني بكالوريا, الثالث بكالوريا, الثالث الثانوي. Transfer
  years (الأول بكالوريا, الأول والثاني الثانوي) get the same structure.
- Home-study students (طلاب المنازل) must be able to do everything without an account.

---

## ✅ Milestone 1 — Product surface (done)

- Navy and gold design system (tokens in `src/styles.css`), Arabic RTL, Arabic fonts, an interim SVG crest, favicon, OG image, Arabic 404 and error pages.
- Home page: hero search, quick-access cards, certificate years, latest files, announcements, upcoming dates, a home-study section, and a "how a file reaches you" explainer.
- Grades index and one space per grade: subjects, files, announcements, schedule (with a real `.ics` calendar export), archive, an academic-year switcher, and in-grade search.
- Library: Arabic-aware search (diacritics, letter forms, colloquial synonyms), filters built only from data that exists, ranking that puts relevance first and adjusts for verification, file detail sheet with full metadata, shareable links, and the source registry.
- Nasser AI preview: grade context, eight study modes, retrieval-only answers with numbered citations, and a plain "no evidence" reply. It doesn't generate claims yet.
- All content comes from `src/data/fixtures.ts` (sample data, labeled in the UI).

## Milestone 2 — Data model on Netlify Database

Replace fixtures with Postgres (Netlify Database + Drizzle, schema in `db/schema.ts`).

- Tables: `academic_systems`, `grades`, `academic_years`, `terms`, `subjects`, `subject_grades`, `units`, `documents`, `document_grades`, `document_versions`, `sources`, `source_checks`, `announcements`, `announcement_grades`, `events`, `tags`, `review_queue`, `feedback_reports`, `system_settings`, `audit_logs`.
- The document lifecycle states are `current`, `outdated`, `unverified`, `withdrawn`, and `unavailable`. Documents are never hard-deleted; versions keep their SHA-256, size, and the previous version's ID.
- Route loaders and server functions return the same types as `src/data/types.ts`, so the components don't change.
- Seed only real structure (systems, grades, the current year). No sample documents in production.
- Before seeding, confirm with the school which grades and subjects are active in 2026–2027.

## Milestone 3 — Auth, roles and the admin panel

- Netlify Identity. Admins only; students never need an account.
- Roles: Super Admin, Content Administrator, Academic Content Editor, Source & Sync Manager, Announcement Editor, Read-only Reviewer. Every check runs on the server.
- `/admin` screens: grades, years, and subjects (add, rename, reorder, activate); documents; announcements (pin with an expiry); events; FAQs and school guide pages; a preview before publishing.
- Audit log of every important action (who, what, when).
- Error-report form on every file ("broken link / wrong file"), handled by Netlify Forms or a DB table and routed to the review queue.

## Milestone 4 — Ministry source monitoring and sync

- Scheduled Netlify Functions (every 6–12 h per source, configurable) plus background functions for heavy work.
- Per source: respect robots.txt and the terms of use; use the sitemap, RSS, ETag, and Last-Modified where available; otherwise use allowed periodic checks. Never bypass logins or protections.
- Pipeline: discover → compare with the previous state → validate the link, content type, size, and that the file isn't an error page → SHA-256 → dedupe → detect changed files at the same URL → classify by rules (grade, subject, term, year, with a confidence score) → auto-publish only when the policy passes, otherwise send to the review queue.
- High-risk items (ministerial decisions, exam dates, conflicts) always go to review.
- Store copies in Netlify Blobs only when re-hosting is permitted; otherwise keep the metadata and the official link.
- Sync jobs and logs, idempotent runs, retries, broken-link checks, an admin dashboard (indexed documents, failing sources, pending reviews, last successful sync), and alerts.
- A public changelog page showing what changed, when, and its verification status.

## Milestone 5 — Document processing and search index

- Text extraction from PDF and DOCX first, with OCR only as a fallback that handles Arabic direction, columns, and digits.
- Structure: headings, pages, units, questions, and tables. Chunks keep their page reference.
- Extraction quality metrics, so low-quality documents are flagged and the assistant won't treat them as complete.
- Hybrid search: Postgres full-text search plus embeddings (pgvector if available), with structured filters. Exact-title and file-number queries still work lexically.

## Milestone 6 — Nasser AI with retrieval-augmented answers

- Server-side provider layer that calls Netlify AI Gateway (Gemini by default, swappable). Keys stay on the server.
- RAG: retrieve chunks filtered by grade, subject, and year, then answer with citations (title, publisher, page, date, source type).
- The hallucination guardrails from the brief go into the system prompt. Imported content is treated as data and never as instructions (prompt-injection safety).
- Study modes become generative: explain, quiz, summarize, review, active recall, mistake analysis, and document Q&A. "Step by step" and "full answer" options.
- Rate limits, timeouts, retries, usage and cost logs (no personal content stored), an admin kill-switch, and an editable assistant name.
- A reference question set (answerable, missing info, wrong premise, mixed grades, past year, conflicting sources) run on a schedule.

## Milestone 7 — Google integrations (only those with keys and a clear purpose)

- Search Console verification, structured data, and canonical URLs.
- Google Calendar sync for verified events (the `.ics` export already works).
- Google Drive import from admin-selected folders, with permissions preserved.
- YouTube Data API for admin-approved channels and playlists.
- External web search through an approved API (for example, Google Programmable Search), prioritizing official domains. Needs an API key and has quota and costs.

## Milestone 8 — School guide, FAQ, about, privacy

- School guide pages built only from verified, officially published information (no invented phone numbers or names).
- FAQ, an about page that states the platform's real status, and a privacy policy with retention periods.

## Milestone 9 — Quality, performance and resilience

- PWA and offline caching for the core pages, performance budgets, and Core Web Vitals monitoring.
- UI, backend, AI, and security test suites (permissions, injection, key exposure).
- Backups and restore drills, error monitoring, and health checks.

---

## External requirements and costs

| Item | Needed for | Notes |
| --- | --- | --- |
| Official school emblem (SVG) | Brand | Replace `src/components/brand/crest.tsx` and `public/favicon.svg` |
| School-approved content and contacts | Guide, announcements | No information is published without it |
| Netlify Database, Blobs, Functions | M2–M5 | Included in the Netlify plan, with usage limits |
| Netlify AI Gateway | M6 | No separate key; usage is billed against the account |
| Google Cloud project and OAuth | M7 | Drive, Calendar, and YouTube APIs; Search API has paid quotas |
