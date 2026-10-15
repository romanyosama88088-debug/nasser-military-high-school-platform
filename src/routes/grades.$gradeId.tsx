import { useState } from 'react'
import { createFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router'
import {
  Archive,
  BookOpen,
  CalendarDays,
  CalendarPlus,
  ChevronLeft,
  Clock,
  FolderOpen,
  House,
  Megaphone,
  Search,
  Sparkles,
} from 'lucide-react'

import { AnnouncementCard } from '@/components/site/announcement-card'
import { DocumentCard } from '@/components/library/document-card'
import { DocumentSheet } from '@/components/library/document-sheet'
import { subjectIcons, VerificationBadge, SampleTag } from '@/components/library/status'
import { EmptyState } from '@/components/site/empty-state'
import { SampleNotice } from '@/components/site/sample-notice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ACADEMIC_YEARS,
  announcementsForGrade,
  CURRENT_YEAR,
  documentsForGrade,
  eventsForGrade,
  getGrade,
  getSubject,
  getSystem,
  subjectsForGrade,
} from '@/data/fixtures'
import { documentTypeLabels, eventKindLabels, formatDate } from '@/data/labels'
import type { DocumentType, Grade, LibraryDocument } from '@/data/types'
import { downloadIcs } from '@/lib/ics'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/grades/$gradeId')({
  loader: ({ params }) => {
    const grade = getGrade(params.gradeId)
    if (!grade || !grade.active) throw notFound()
    return { grade }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.grade.name} — Nasser Military High School` },
          {
            name: 'description',
            content: `مساحة ${loaderData.grade.name}: المواد والكتب والتقييمات والنماذج والإعلانات والمواعيد مع مصدر كل ملف.`,
          },
        ]
      : [],
  }),
  component: GradePage,
})

function GradePage() {
  const { grade } = Route.useLoaderData()
  // Keyed so tab/filter state resets when moving between grades.
  return <GradeView key={grade.id} grade={grade} />
}

function GradeView({ grade }: { grade: Grade }) {
  const navigate = useNavigate()
  const system = getSystem(grade.systemId)
  const [year, setYear] = useState<string>(CURRENT_YEAR)
  const [tab, setTab] = useState('subjects')
  const [subjectFilter, setSubjectFilter] = useState<string | undefined>()
  const [typeFilter, setTypeFilter] = useState<DocumentType | undefined>()
  const [openDoc, setOpenDoc] = useState<LibraryDocument | null>(null)
  const [q, setQ] = useState('')

  const subjects = subjectsForGrade(grade.id)
  const allDocs = documentsForGrade(grade.id)
  const yearDocs = allDocs.filter((d) => d.academicYear === year)
  const archiveDocs = allDocs.filter((d) => d.academicYear !== CURRENT_YEAR)
  const announcements = announcementsForGrade(grade.id)
  const events = eventsForGrade(grade.id).sort((a, b) => a.date.localeCompare(b.date))

  const filteredDocs = yearDocs.filter(
    (d) => (!subjectFilter || d.subjectId === subjectFilter) && (!typeFilter || d.type === typeFilter),
  )
  const tabs = [
    { value: 'subjects', label: 'المواد', icon: BookOpen, count: subjects.length },
    { value: 'files', label: 'الملفات', icon: FolderOpen, count: yearDocs.length },
    { value: 'announcements', label: 'الإعلانات', icon: Megaphone, count: announcements.length },
    { value: 'schedule', label: 'المواعيد', icon: CalendarDays, count: events.length },
    { value: 'archive', label: 'الأرشيف', icon: Archive, count: archiveDocs.length },
  ]
  const typesPresent = [...new Set(yearDocs.map((d) => d.type))]

  return (
    <main>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pattern-girih absolute inset-0 opacity-[0.06]" aria-hidden />
        <div className="relative mx-auto max-w-content px-4 pt-6 pb-10 sm:px-6 sm:pb-12">
          <nav aria-label="مسار التنقل" className="mb-6 flex items-center gap-1 text-sm text-white/60">
            <Link to="/" className="flex items-center gap-1 hover:text-white">
              <House className="size-3.5" aria-hidden />
              الرئيسية
            </Link>
            <ChevronLeft className="size-3.5" aria-hidden />
            <Link to="/grades" className="hover:text-white">الصفوف الدراسية</Link>
            <ChevronLeft className="size-3.5" aria-hidden />
            <span aria-current="page" className="text-white">{grade.name}</span>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-gold-500/50 px-3 py-1 text-xs text-gold-300">
                  {system?.name}
                </span>
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    grade.stage === 'certificate' ? 'bg-gold-500 text-navy-950' : 'bg-white/10 text-white',
                  )}
                >
                  {grade.stage === 'certificate' ? 'سنة شهادة' : 'سنة نقل'}
                </span>
              </div>
              <h1 className="text-3xl font-bold sm:text-4xl">{grade.name}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/65">
                <Clock className="size-4" aria-hidden />
                آخر تحديث للمحتوى: {formatDate(grade.lastUpdated)}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <span className="text-xs text-white/60" id="year-label">السنة الدراسية</span>
              <div role="radiogroup" aria-labelledby="year-label" className="flex rounded-lg border border-white/15 bg-white/5 p-1">
                {ACADEMIC_YEARS.map((y) => (
                  <button
                    key={y}
                    role="radio"
                    aria-checked={year === y}
                    onClick={() => setYear(y)}
                    className={cn(
                      'numerals rounded-md px-3 py-1.5 text-sm transition-colors',
                      year === y ? 'bg-gold-500 font-semibold text-navy-950' : 'text-white/75 hover:text-white',
                    )}
                    dir="ltr"
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-[1fr_auto]">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                void navigate({ to: '/library', search: { grade: grade.id, q: q || undefined } })
              }}
              className="flex items-center gap-2 rounded-xl bg-white p-1.5"
            >
              <Label htmlFor="grade-q" className="sr-only">ابحث داخل {grade.name}</Label>
              <Search className="ms-2 size-5 shrink-0 text-gold-600" aria-hidden />
              <Input
                id="grade-q"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`ابحث داخل ${grade.shortName}…`}
                className="h-10 border-0 text-ink shadow-none focus-visible:ring-0"
              />
              <Button type="submit">بحث</Button>
            </form>
            <Button asChild variant="gold" size="lg" className="h-[3.25rem]">
              <Link to="/assistant" search={{ grade: grade.id }}>
                <Sparkles aria-hidden />
                اسأل Nasser AI عن مواد الصف
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <SampleNotice className="mb-6" />

        {year !== CURRENT_YEAR && (
          <p role="status" className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-3 text-sm">
            <Archive className="size-4 text-muted-foreground" aria-hidden />
            تعرض الآن محتوى السنة الدراسية <span dir="ltr" className="numerals font-semibold">{year}</span>.
            قد لا يطابق مواصفات العام الحالي.
          </p>
        )}

        <Tabs value={tab} onValueChange={setTab} dir="rtl">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <TabsList variant="line" className="h-11 w-full justify-start gap-2 border-b border-border">
              {tabs.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="flex-none px-3 text-[0.95rem] after:bg-gold-500 data-[state=active]:text-navy-900"
                >
                  <t.icon aria-hidden />
                  {t.label}
                  <span className="numerals rounded-full bg-muted px-1.5 text-xs text-muted-foreground">{t.count}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="subjects" className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((s, i) => {
                const Icon = subjectIcons[s.icon]
                const docs = yearDocs.filter((d) => d.subjectId === s.id)
                const types = [...new Set(docs.map((d) => d.type))]
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSubjectFilter(s.id)
                      setTypeFilter(undefined)
                      setTab('files')
                    }}
                    style={{ animationDelay: `${i * 30}ms` }}
                    className="rise-in group flex items-start gap-4 rounded-xl border border-border bg-card p-4 text-start transition-colors hover:border-gold-500/60"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-navy-900 transition-colors group-hover:bg-navy-900 group-hover:text-gold-300">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-navy-900">{s.name}</span>
                      {s.englishName && (
                        <span className="block text-xs text-muted-foreground" dir="ltr">{s.englishName}</span>
                      )}
                      <span className="mt-2 block text-sm text-muted-foreground">
                        {docs.length === 0
                          ? 'لم تُضف ملفات موثقة لهذه المادة بعد'
                          : `${docs.length} ${docs.length === 1 ? 'ملف' : 'ملفات'}: ${types.map((t) => documentTypeLabels[t]).join('، ')}`}
                      </span>
                    </span>
                    <ChevronLeft className="mt-1 size-4 text-muted-foreground group-hover:text-gold-600" aria-hidden />
                  </button>
                )
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              قائمة المواد قابلة للتعديل من لوحة الإدارة، وتُعرض هنا كما يعتمدها المسؤول.
            </p>
          </TabsContent>

          <TabsContent value="files" className="pt-6">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <FilterChip active={!subjectFilter && !typeFilter} onClick={() => { setSubjectFilter(undefined); setTypeFilter(undefined) }}>
                الكل
              </FilterChip>
              {typesPresent.map((t) => (
                <FilterChip key={t} active={typeFilter === t} onClick={() => setTypeFilter(typeFilter === t ? undefined : t)}>
                  {documentTypeLabels[t]}
                </FilterChip>
              ))}
              {subjectFilter && (
                <FilterChip active onClick={() => setSubjectFilter(undefined)}>
                  {getSubject(subjectFilter)?.name} ✕
                </FilterChip>
              )}
            </div>
            {filteredDocs.length === 0 ? (
              <EmptyState icon={FolderOpen} title="لم تُضف مواد موثقة لهذا القسم بعد">
                نضيف الملفات بعد التحقق من مصدرها. يمكنك البحث في المكتبة كاملة
                أو العودة لاحقًا.
              </EmptyState>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDocs.map((d) => (
                  <DocumentCard key={d.id} doc={d} onOpen={setOpenDoc} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="announcements" className="pt-6">
            {announcements.length === 0 ? (
              <EmptyState icon={Megaphone} title="لا توجد إعلانات لهذا الصف حاليًا" />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {announcements.map((a) => (
                  <AnnouncementCard key={a.id} announcement={a} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="pt-6">
            {events.length === 0 ? (
              <EmptyState icon={CalendarDays} title="لا توجد مواعيد منشورة لهذا الصف">
                لا نضيف مواعيد امتحانات دون مصدر موثوق.
              </EmptyState>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    المواعيد «قيد المراجعة» لم تصدر من مصدر رسمي بعد، فلا تعتمد عليها.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      downloadIcs(
                        events.filter((e) => e.verification === 'verified'),
                        `مواعيد ${grade.name}`,
                        `nasser-${grade.id}-schedule.ics`,
                      )
                    }
                  >
                    <CalendarPlus aria-hidden />
                    أضف المواعيد الموثقة إلى تقويمك
                  </Button>
                </div>
                <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                  {events.map((e) => {
                    const d = new Date(`${e.date}T12:00:00`)
                    return (
                      <li key={e.id} className="flex items-center gap-4 p-4">
                        <span className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-navy-900 py-1.5 text-white">
                          <span className="numerals text-xl font-bold leading-none">
                            {d.toLocaleDateString('ar-EG', { day: 'numeric' })}
                          </span>
                          <span className="mt-1 text-[0.7rem] text-gold-300">
                            {d.toLocaleDateString('ar-EG', { month: 'short' })}
                          </span>
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-navy-900">{e.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {eventKindLabels[e.kind]} · المصدر: {e.sourceLabel}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <VerificationBadge status={e.verification} />
                          <SampleTag />
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </>
            )}
          </TabsContent>

          <TabsContent value="archive" className="pt-6">
            {archiveDocs.length === 0 ? (
              <EmptyState icon={Archive} title="لا يوجد أرشيف لهذا الصف بعد">
                تُنقل ملفات السنوات السابقة إلى هنا تلقائيًا عند بدء سنة دراسية
                جديدة، مع الإبقاء على تاريخها ومصدرها.
              </EmptyState>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {archiveDocs.map((d) => (
                  <DocumentCard key={d.id} doc={d} onOpen={setOpenDoc} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <aside className="mt-12 grid gap-6 rounded-2xl border border-gold-500/30 bg-card p-6 md:grid-cols-[auto_1fr] md:items-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-navy-900 text-gold-300">
            <House className="size-7" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-bold text-navy-900">طالب منازل؟</h2>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              كل ما يخص {grade.shortName} متاح هنا دون الحاجة للحضور: الكتب
              والتقييمات المطلوبة والنماذج ومواعيد الامتحانات عند صدورها. ابدأ من
              تبويب «الملفات»، واسأل Nasser AI إن احتجت إلى شرح.
            </p>
          </div>
        </aside>
      </div>

      <DocumentSheet doc={openDoc} onOpenChange={(open) => !open && setOpenDoc(null)} />
    </main>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-colors',
        active
          ? 'border-navy-900 bg-navy-900 text-white'
          : 'border-border bg-card text-navy-800 hover:border-gold-500/60',
      )}
    >
      {children}
    </button>
  )
}
