import { useState } from 'react'
import { createFileRoute, Link, linkOptions, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileSearch,
  FileText,
  House,
  Megaphone,
  Radar,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
  Tags,
  type LucideIcon,
} from 'lucide-react'

import { Crest } from '@/components/brand/crest'
import { DocumentCard } from '@/components/library/document-card'
import { DocumentSheet } from '@/components/library/document-sheet'
import { SampleTag, VerificationBadge } from '@/components/library/status'
import { AnnouncementCard } from '@/components/site/announcement-card'
import { EmptyState, SectionHeading } from '@/components/site/empty-state'
import { GradeCard } from '@/components/site/grade-card'
import { SampleNotice } from '@/components/site/sample-notice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { announcements, events, getGrade, grades, latestDocuments } from '@/data/fixtures'
import { eventKindLabels } from '@/data/labels'
import type { LibraryDocument } from '@/data/types'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [openDoc, setOpenDoc] = useState<LibraryDocument | null>(null)
  const latest = latestDocuments(6)
  const certificate = grades.filter((g) => g.stage === 'certificate' && g.active).sort((a, b) => a.order - b.order)
  const transfer = grades.filter((g) => g.stage === 'transfer' && g.active).sort((a, b) => a.order - b.order)
  const pinnedFirst = [...announcements]
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3)
  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4)

  return (
    <main>
      <Hero />

      <section aria-labelledby="quick-heading" className="relative z-10 mx-auto -mt-10 max-w-content px-4 sm:px-6">
        <h2 id="quick-heading" className="sr-only">الوصول السريع</h2>
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-3 shadow-[0_20px_50px_-30px_rgba(8,21,46,0.5)] sm:grid-cols-4">
          {QUICK.map((q, i) => (
            <QuickCard key={q.label} {...q} style={{ animationDelay: `${i * 40}ms` }} />
          ))}
        </div>
      </section>

      <section aria-labelledby="grades-heading" className="mx-auto max-w-content px-4 pt-16 sm:px-6" id="grades">
        <SectionHeading
          id="grades-heading"
          eyebrow="سنوات الشهادة"
          title="الصفوف التي تحتاج تركيزك الآن"
          action={
            <Button asChild variant="outline">
              <Link to="/grades">
                كل الصفوف
                <ArrowLeft aria-hidden />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          {certificate.map((g) => (
            <GradeCard key={g.id} grade={g} />
          ))}
        </div>
        <h3 className="mt-8 mb-3 text-sm font-semibold text-muted-foreground">سنوات النقل</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {transfer.map((g) => (
            <Link
              key={g.id}
              to="/grades/$gradeId"
              params={{ gradeId: g.id }}
              className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 hover:border-gold-500/60"
            >
              <span>
                <span className="block font-semibold text-navy-900">{g.name}</span>
                <span className="text-xs text-muted-foreground">{g.summary}</span>
              </span>
              <ArrowLeft className="size-4 shrink-0 text-muted-foreground group-hover:text-gold-600" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="latest-heading" className="mx-auto max-w-content px-4 pt-16 sm:px-6" id="updates">
        <SectionHeading
          id="latest-heading"
          eyebrow="المستجدات"
          title="أحدث الملفات الموثقة"
          action={
            <Button asChild variant="outline">
              <Link to="/library" search={{}}>
                افتح المكتبة
                <ArrowLeft aria-hidden />
              </Link>
            </Button>
          }
        />
        <SampleNotice className="mb-5" />
        {latest.length === 0 ? (
          <EmptyState icon={FileText} title="لم تُضف مواد جديدة موثقة بعد" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((d) => (
              <DocumentCard key={d.id} doc={d} onOpen={setOpenDoc} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto grid max-w-content gap-10 px-4 pt-16 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
        <div id="announcements" aria-labelledby="ann-heading">
          <SectionHeading id="ann-heading" eyebrow="الإعلانات" title="آخر الإعلانات" />
          <div className="grid gap-4">
            {pinnedFirst.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        </div>
        <div id="dates" aria-labelledby="dates-heading">
          <SectionHeading id="dates-heading" eyebrow="الجداول والمواعيد" title="المواعيد القادمة" />
          <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {upcoming.map((e) => {
              const d = new Date(`${e.date}T12:00:00`)
              return (
                <li key={e.id} className="flex gap-3 p-4">
                  <span className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-navy-900 py-1 text-white">
                    <span className="numerals text-lg font-bold">{d.toLocaleDateString('ar-EG', { day: 'numeric' })}</span>
                    <span className="text-[0.65rem] text-gold-300">{d.toLocaleDateString('ar-EG', { month: 'short' })}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-6 text-navy-900">{e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {eventKindLabels[e.kind]} · {e.gradeIds.map((g) => getGrade(g)?.shortName).join('، ')}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <VerificationBadge status={e.verification} />
                      <SampleTag />
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            لا نضيف موعد امتحان دون مصدر. افتح صفحة صفك لتصدير المواعيد الموثقة إلى تقويم هاتفك.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 pt-16 sm:px-6" aria-labelledby="home-study-heading">
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-8 text-white sm:p-10">
          <div className="pattern-girih absolute inset-0 opacity-[0.07]" aria-hidden />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm text-gold-300">
                <House className="size-4" aria-hidden />
                لطلاب المنازل
              </p>
              <h2 id="home-study-heading" className="text-2xl font-bold sm:text-3xl">
                تذاكر من البيت؟ المنصة صُممت لك أيضًا
              </h2>
              <p className="mt-3 max-w-2xl leading-8 text-white/75">
                الكتب والتقييمات المطلوبة والنماذج ومواعيد الامتحانات حال صدورها،
                مرتبة لصفك في صفحة واحدة. لا تحتاج حسابًا ولا تسجيل دخول.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
              <Button asChild variant="gold" size="lg">
                <Link to="/grades">اختر صفك</Link>
              </Button>
              <Button asChild variant="onDark" size="lg">
                <Link to="/assistant">اسأل Nasser AI</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 pt-16 sm:px-6" aria-labelledby="trust-heading">
        <SectionHeading id="trust-heading" eyebrow="مصداقية المحتوى" title="كيف يصل الملف إليك" />
        <ol className="grid gap-4 md:grid-cols-4">
          {TRUST_STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-border bg-card p-5">
              <span className="numerals absolute top-4 end-4 font-brand text-2xl text-gold-500/50">{i + 1}</span>
              <s.icon className="size-7 text-gold-600" aria-hidden />
              <h3 className="mt-3 font-semibold text-navy-900">{s.title}</h3>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>دلالات الحالة:</span>
          <VerificationBadge status="verified" />
          <VerificationBadge status="pending" />
          <VerificationBadge status="outdated" />
          <VerificationBadge status="withdrawn" />
        </div>
      </section>

      <DocumentSheet doc={openDoc} onOpenChange={(open) => !open && setOpenDoc(null)} />
    </main>
  )
}

function Hero() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="pattern-girih absolute inset-0 opacity-[0.08]" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(201,164,91,0.16),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-content items-center gap-10 px-4 pt-14 pb-24 sm:px-6 md:grid-cols-[1fr_auto] md:pt-20 md:pb-28">
        <div className="rise-in">
          <p className="font-brand text-sm tracking-[0.18em] text-gold-300" dir="ltr" lang="en">
            NASSER MILITARY HIGH SCHOOL
          </p>
          <div className="gold-rule my-4 w-40" />
          <h1 className="text-[2rem] leading-[1.4] font-extrabold sm:text-5xl sm:leading-[1.35]">
            كتبك وتقييماتك ومواعيدك
            <br />
            <span className="text-gold-300">في مكان واحد، بمصدر موثّق</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
            المنصة التعليمية لطلاب مدرسة ناصر الثانوية العسكرية بأسيوط وطلاب
            المنازل: ملفات الوزارة منظمة حسب الصف والمادة، مع تاريخ آخر تحديث
            لكل ملف.
          </p>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              void navigate({ to: '/library', search: { q: q.trim() || undefined } })
            }}
            className="mt-8 flex max-w-xl items-center gap-2 rounded-xl border border-gold-500/40 bg-white p-1.5 shadow-xl"
          >
            <Label htmlFor="hero-q" className="sr-only">ابحث عن كتاب أو تقييم أو نموذج</Label>
            <Search className="ms-2 size-5 shrink-0 text-gold-600" aria-hidden />
            <Input
              id="hero-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن كتاب، تقييم، نموذج…"
              className="h-11 border-0 text-base text-ink shadow-none focus-visible:ring-0"
              autoComplete="off"
            />
            <Button type="submit" size="lg">بحث</Button>
          </form>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg">
              <Link to="/grades">
                اختر صفك
                <ArrowLeft aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="onDark" size="lg">
              <Link to="/assistant">
                <Sparkles aria-hidden />
                اسأل Nasser AI
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative hidden md:block" aria-hidden>
          <div className="absolute inset-0 -m-10 rounded-full border border-gold-500/15" />
          <div className="absolute inset-0 -m-20 rounded-full border border-gold-500/10" />
          <Crest className="relative h-72 w-64 drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]" title="" />
        </div>
      </div>
    </section>
  )
}

const QUICK = linkOptions([
  { label: 'الكتب الدراسية', hint: 'PDF رسمية', icon: BookOpen, to: '/library', search: { type: 'book' } },
  { label: 'التقييمات', hint: 'أسبوعية ودورية', icon: ClipboardCheck, to: '/library', search: { type: 'assessment' } },
  { label: 'النماذج الاسترشادية', hint: 'للتدريب', icon: FileText, to: '/library', search: { type: 'model' } },
  { label: 'الامتحانات', hint: 'سنوات سابقة', icon: ScrollText, to: '/library', search: { type: 'exam' } },
  { label: 'الإعلانات', hint: 'رسمية ومدرسية', icon: Megaphone, to: '/', hash: 'announcements' },
  { label: 'الجداول والمواعيد', hint: 'اختبارات وتسليم', icon: CalendarDays, to: '/', hash: 'dates' },
  { label: 'ثانية بكالوريا', hint: 'سنة شهادة', icon: ShieldCheck, to: '/grades/$gradeId', params: { gradeId: 'bac-2' } },
  { label: 'Nasser AI', hint: 'المساعد التعليمي', icon: Sparkles, to: '/assistant' },
])

function QuickCard({
  label,
  hint,
  icon: Icon,
  style,
  ...link
}: (typeof QUICK)[number] & { style?: React.CSSProperties }) {
  return (
    <Link
      {...link}
      style={style}
      className="rise-in group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-ivory"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-300 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-navy-900">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </Link>
  )
}

const TRUST_STEPS: { title: string; body: string; icon: LucideIcon }[] = [
  { title: 'الاكتشاف', body: 'نتابع الموقع الرسمي للوزارة والمصادر المعتمدة دوريًا بحثًا عن ملفات جديدة أو معدّلة.', icon: Radar },
  { title: 'الفحص', body: 'نتحقق من سلامة الرابط ونوع الملف وبصمته الرقمية، ونكتشف النسخ المكررة.', icon: FileSearch },
  { title: 'التصنيف', body: 'نحدد الصف والمادة والسنة الدراسية، وما لا يتضح يذهب إلى مراجعة المسؤول.', icon: Tags },
  { title: 'النشر', body: 'يُنشر الملف بمصدره وتاريخه وحالة التحقق منه، مع الاحتفاظ بالإصدارات السابقة.', icon: ShieldCheck },
]
