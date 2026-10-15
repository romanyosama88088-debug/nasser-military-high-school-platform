import { useEffect, useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Library, Radar, Search, SearchX, SlidersHorizontal, X } from 'lucide-react'

import { DocumentCard } from '@/components/library/document-card'
import { DocumentSheet } from '@/components/library/document-sheet'
import { SampleNotice } from '@/components/site/sample-notice'
import { EmptyState, SectionHeading } from '@/components/site/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { documents, getGrade, getSubject, grades, sources, subjects } from '@/data/fixtures'
import { documentTypeLabels, termLabels, verificationLabels } from '@/data/labels'
import type { DocumentType, Term, VerificationStatus } from '@/data/types'
import { searchDocuments } from '@/lib/search'

interface LibrarySearch {
  q?: string
  grade?: string
  subject?: string
  type?: DocumentType
  year?: string
  term?: Term
  verification?: VerificationStatus
  doc?: string
}

const str = (v: unknown, max = 100) =>
  typeof v === 'string' && v.trim() ? v.slice(0, max) : undefined

const oneOf = <T extends string>(v: unknown, allowed: readonly T[]) =>
  allowed.includes(v as T) ? (v as T) : undefined

export const Route = createFileRoute('/library')({
  validateSearch: (input: Record<string, unknown>): LibrarySearch => ({
    q: str(input.q),
    grade: oneOf(input.grade, grades.map((g) => g.id)),
    subject: oneOf(input.subject, subjects.map((s) => s.id)),
    type: oneOf(input.type, Object.keys(documentTypeLabels) as DocumentType[]),
    year: str(input.year, 12),
    term: oneOf(input.term, Object.keys(termLabels) as Term[]),
    verification: oneOf(
      input.verification,
      Object.keys(verificationLabels) as VerificationStatus[],
    ),
    doc: str(input.doc, 80),
  }),
  head: () => ({
    meta: [
      { title: 'المكتبة التعليمية — Nasser Military High School' },
      {
        name: 'description',
        content: 'ابحث في الكتب والتقييمات والنماذج والامتحانات حسب الصف والمادة والسنة الدراسية، مع مصدر كل ملف وتاريخ آخر تحقق.',
      },
    ],
  }),
  component: LibraryPage,
})

const SUGGESTIONS = ['تقييم رياضيات', 'نموذج فيزياء', 'كتاب الإنجليزي', 'امتحان كيمياء']

/** Only offer filter values that actually exist in the content. */
function useFilterOptions() {
  return useMemo(() => {
    const uniq = <T,>(xs: T[]) => [...new Set(xs)]
    return {
      grades: grades.filter((g) => documents.some((d) => d.gradeIds.includes(g.id))),
      subjects: uniq(documents.map((d) => d.subjectId).filter(Boolean) as string[])
        .map((id) => getSubject(id)!)
        .filter(Boolean),
      types: uniq(documents.map((d) => d.type)),
      years: uniq(documents.map((d) => d.academicYear)).sort().reverse(),
      terms: uniq(documents.map((d) => d.term)),
      verification: uniq(documents.map((d) => d.verification)),
    }
  }, [])
}

function LibraryPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const options = useFilterOptions()
  const [query, setQuery] = useState(search.q ?? '')

  useEffect(() => setQuery(search.q ?? ''), [search.q])

  // Debounce URL updates while typing.
  useEffect(() => {
    if ((search.q ?? '') === query) return
    const t = setTimeout(() => {
      void navigate({ search: (prev) => ({ ...prev, q: query || undefined }), replace: true })
    }, 250)
    return () => clearTimeout(t)
  }, [query, search.q, navigate])

  const hits = useMemo(
    () => searchDocuments(documents, search.q ?? '', search),
    [search],
  )
  const openDoc = documents.find((d) => d.id === search.doc) ?? null

  const setFilter = (key: keyof LibrarySearch, value?: string) =>
    navigate({
      search: (prev) => ({ ...prev, [key]: value, doc: undefined }) as LibrarySearch,
      resetScroll: false,
    })

  const activeFilters = (['grade', 'subject', 'type', 'year', 'term', 'verification'] as const).filter(
    (k) => search[k],
  )

  return (
    <main>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pattern-girih absolute inset-0 opacity-[0.07]" aria-hidden />
        <div className="relative mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-14">
          <p className="mb-2 text-sm text-gold-300">المكتبة التعليمية</p>
          <h1 className="text-3xl font-bold sm:text-4xl">كل ملف بمصدره وتاريخه</h1>
          <p className="mt-3 max-w-2xl leading-8 text-white/75">
            الكتب والتقييمات والنماذج والامتحانات مرتبة حسب الصف والمادة والسنة
            الدراسية. ابحث بالعربية أو الإنجليزية، حتى بالكتابة العامية.
          </p>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              void navigate({ search: (prev) => ({ ...prev, q: query || undefined }) })
            }}
            className="mt-6 flex max-w-2xl items-center gap-2 rounded-xl border border-gold-500/40 bg-white p-1.5 shadow-lg"
          >
            <Label htmlFor="library-q" className="sr-only">ابحث في المكتبة</Label>
            <Search className="ms-2 size-5 shrink-0 text-gold-600" aria-hidden />
            <Input
              id="library-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="مثال: تقييم رياضيات ثانية بكالوريا"
              className="h-11 border-0 text-base text-ink shadow-none focus-visible:ring-0"
              autoComplete="off"
            />
            <Button type="submit" size="lg" className="shrink-0">بحث</Button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setQuery(s)
                  void navigate({ search: (prev) => ({ ...prev, q: s }) })
                }}
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:border-gold-500/60 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <SampleNotice className="mb-6" />

        <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
          <aside aria-label="تصفية النتائج" className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-navy-900">
                <SlidersHorizontal className="size-4 text-gold-600" aria-hidden />
                التصفية
              </h2>
              {activeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ search: { q: search.q } })}
                >
                  مسح الكل
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <FilterSelect
                label="الصف"
                value={search.grade}
                onChange={(v) => setFilter('grade', v)}
                options={options.grades.map((g) => [g.id, g.name] as const)}
              />
              <FilterSelect
                label="المادة"
                value={search.subject}
                onChange={(v) => setFilter('subject', v)}
                options={options.subjects.map((s) => [s.id, s.name] as const)}
              />
              <FilterSelect
                label="نوع المحتوى"
                value={search.type}
                onChange={(v) => setFilter('type', v)}
                options={options.types.map((t) => [t, documentTypeLabels[t]] as const)}
              />
              <FilterSelect
                label="السنة الدراسية"
                value={search.year}
                onChange={(v) => setFilter('year', v)}
                options={options.years.map((y) => [y, y] as const)}
              />
              <FilterSelect
                label="الفصل الدراسي"
                value={search.term}
                onChange={(v) => setFilter('term', v)}
                options={options.terms.map((t) => [t, termLabels[t]] as const)}
              />
              <FilterSelect
                label="حالة التحقق"
                value={search.verification}
                onChange={(v) => setFilter('verification', v)}
                options={options.verification.map((v) => [v, verificationLabels[v].label] as const)}
              />
            </div>
          </aside>

          <section aria-labelledby="results-heading" aria-live="polite">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 id="results-heading" className="text-base font-semibold text-navy-900">
                {search.q ? <>نتائج «{search.q}»</> : 'كل الملفات'}
              </h2>
              <span className="numerals text-sm text-muted-foreground">({hits.length})</span>
              {activeFilters.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k, undefined)}
                  className="inline-flex items-center gap-1 rounded-full bg-navy-900 px-2.5 py-1 text-xs text-white hover:bg-navy-800"
                  aria-label={`إزالة عامل التصفية ${filterLabel(k, search[k]!)}`}
                >
                  {filterLabel(k, search[k]!)}
                  <X className="size-3" aria-hidden />
                </button>
              ))}
            </div>

            {hits.length === 0 ? (
              <EmptyState icon={SearchX} title="لا توجد ملفات مطابقة">
                جرّب كلمات أقل أو أزل بعض عوامل التصفية. إذا كنت تبحث عن ملف
                رسمي لم يُضف بعد، يمكنك سؤال Nasser AI عن مكان نشره.
              </EmptyState>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {hits.map(({ doc }, i) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    className="rise-in"
                    style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
                    onOpen={(d) => navigate({ search: (prev) => ({ ...prev, doc: d.id }), resetScroll: false })}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="mt-16" aria-labelledby="sources-heading">
          <SectionHeading id="sources-heading" eyebrow="سجل المصادر" title="المصادر التي تتابعها المنصة" />
          <div className="grid gap-4 md:grid-cols-2">
            {sources.map((s) => (
              <article key={s.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold leading-7 text-navy-900">{s.name}</h3>
                  <SourceStatusPill status={s.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{s.publisher}</p>
                <dl className="mt-4 grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">المحتوى المتوقع:</dt>
                    <dd>{s.expectedContent.join('، ')}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">طريقة المتابعة:</dt>
                    <dd>{s.checkMethod}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">الوتيرة:</dt>
                    <dd>{s.frequency}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">{s.notes}</p>
                {s.baseUrl && (
                  <a
                    href={s.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="mt-3 inline-block text-sm text-navy-700 underline underline-offset-4 hover:text-navy-900"
                  >
                    {new URL(s.baseUrl).host}
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>

      <DocumentSheet
        doc={openDoc}
        onOpenChange={(open) => {
          if (!open) void navigate({ search: (prev) => ({ ...prev, doc: undefined }), resetScroll: false })
        }}
      />
    </main>
  )
}

function filterLabel(key: keyof LibrarySearch, value: string) {
  switch (key) {
    case 'grade':
      return getGrade(value)?.shortName ?? value
    case 'subject':
      return getSubject(value)?.name ?? value
    case 'type':
      return documentTypeLabels[value as DocumentType]
    case 'term':
      return termLabels[value as Term]
    case 'verification':
      return verificationLabels[value as VerificationStatus].label
    default:
      return value
  }
}

function SourceStatusPill({ status }: { status: (typeof sources)[number]['status'] }) {
  const map = {
    monitoring: { label: 'قيد المتابعة الآلية', cls: 'bg-success-soft text-success' },
    listed: { label: 'مُدرج — المزامنة قيد الإعداد', cls: 'bg-accent text-navy-800' },
    'awaiting-input': { label: 'بانتظار إضافة الروابط', cls: 'bg-muted text-muted-foreground' },
  } as const
  const s = map[status]
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}>
      {status === 'monitoring' ? <Radar className="size-3.5" aria-hidden /> : <Library className="size-3.5" aria-hidden />}
      {s.label}
    </span>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value?: string
  onChange: (value?: string) => void
  options: (readonly [string, string])[]
}) {
  if (options.length < 2) return null
  const id = `filter-${label}`
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
      <Select dir="rtl" value={value ?? 'all'} onValueChange={(v) => onChange(v === 'all' ? undefined : v)}>
        <SelectTrigger id={id} className="w-full bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">الكل</SelectItem>
          {options.map(([v, l]) => (
            <SelectItem key={v} value={v}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
