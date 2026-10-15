# Nasser Military High School

**Nasser Military High School — Assiut, Egypt** · مدرسة ناصر الثانوية العسكرية بأسيوط

A digital learning platform for the school's students and for home-study students (طلاب المنازل).
It brings official textbooks, assessments, model exams, past exams, announcements, and dates
together in one place. Every file shows its source, its verification status, and when it was last checked.

The interface is Arabic-first (RTL). It uses a navy and gold academic identity and is designed mobile first.

## What works today

- **Home**: search, quick access, certificate years, latest files, announcements, upcoming dates.
- **Grades** (`/grades`, `/grades/:id`): six grade spaces across the Egyptian Baccalaureate and General Secondary systems. Each has subjects, files, announcements, a schedule with calendar (`.ics`) export, an archive, and an academic-year switcher.
- **Library** (`/library`): Arabic-aware search with filters by grade, subject, type, year, term, and verification. A detail sheet shows full metadata, and the source registry is on the same page.
- **Nasser AI** (`/assistant`): a preview that retrieves matching library files with numbered citations, or states plainly that nothing supports an answer. It isn't connected to a language model yet.

> The content currently shown is **sample data** (`src/data/fixtures.ts`), labeled as such in the UI.
> It shows how the platform presents information. It isn't official school or ministry content.

## Tech stack

- TanStack Start (React 19, TanStack Router) on Netlify
- Tailwind CSS 4 with design tokens, and shadcn/ui (Radix) components
- TypeScript (strict), Vitest
- Fonts: Noto Kufi Arabic (headings), IBM Plex Sans Arabic (body), Cinzel (English wordmark)

## Running locally

```bash
pnpm install
pnpm dev            # http://localhost:3000
# or, with Netlify platform emulation:
netlify dev
pnpm test           # search and assistant-retrieval tests, UI tests
```

## Replacing the interim emblem

The crest is an interim SVG mark. Replace the SVG in `src/components/brand/crest.tsx` and
`public/favicon.svg` (and `public/og-image.svg`) with the school's official emblem. No page changes are needed.

## Roadmap

See [PLAN.md](PLAN.md). In short:

1. ✅ Product surface (this release)
2. Data model on Netlify Database (replaces the fixtures)
3. Admin panel with role-based access and an audit log
4. Monitoring Ministry of Education sources: scheduled sync, hashing, versioning, review queue
5. Document processing (PDF text and OCR) and a hybrid search index
6. Nasser AI with retrieval-augmented, cited answers via Netlify AI Gateway
7. Google integrations (Search Console, Calendar, Drive, YouTube, web search)
8. School guide, FAQ, about, privacy
9. Performance, PWA, tests, backups
