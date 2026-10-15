import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUp, Bot, CalendarDays, Info, SearchX, ShieldCheck, Sparkles, User } from 'lucide-react'

import { documentTypeIcons, SampleTag, VerificationBadge } from '@/components/library/status'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getGrade, getSource, grades } from '@/data/fixtures'
import { documentTypeLabels, eventKindLabels, formatDate } from '@/data/labels'
import { answerPreview, assistantModes, type AssistantMode, type PreviewAnswer } from '@/lib/assistant-preview'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/assistant')({
  validateSearch: (input: Record<string, unknown>): { grade?: string } => ({
    grade: grades.some((g) => g.id === input.grade) ? (input.grade as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: 'Nasser AI — المساعد التعليمي | Nasser Military High School' },
      { name: 'description', content: 'مساعد تعليمي يجيب من مصادر المكتبة ويعرض المرجع وتاريخه، ويصرّح عندما لا تكفي المعلومات.' },
    ],
  }),
  component: AssistantPage,
})

type Message =
  | { id: number; role: 'user'; text: string }
  | { id: number; role: 'assistant'; answer: PreviewAnswer }

const STARTERS = [
  'أين أجد تقييم الرياضيات الأسبوعي؟',
  'عايز نموذج استرشادي في الكيمياء',
  'امتى اختبار شهر أكتوبر؟',
  'اشرح لي قانون أوم',
]

function AssistantPage() {
  const search = Route.useSearch()
  const [gradeId, setGradeId] = useState<string | undefined>(search.grade)
  const [mode, setMode] = useState<AssistantMode>('explain')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)

  useEffect(() => {
    if (messages.length === 0) return
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking])

  function ask(text: string) {
    const question = text.trim()
    if (!question || thinking) return
    setMessages((m) => [...m, { id: nextId.current++, role: 'user', text: question.slice(0, 1000) }])
    setInput('')
    setThinking(true)
    // Retrieval is local and instant; the short delay keeps the turn readable.
    setTimeout(() => {
      setMessages((m) => [...m, { id: nextId.current++, role: 'assistant', answer: answerPreview(question, mode, gradeId) }])
      setThinking(false)
    }, 350)
  }

  const grade = gradeId ? getGrade(gradeId) : undefined
  const activeMode = assistantModes.find((m) => m.id === mode)!

  return (
    <main className="mx-auto max-w-content px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-navy-900 text-gold-300">
            <Sparkles className="size-6" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">
              <span dir="ltr">Nasser AI</span> — المساعد التعليمي
            </h1>
            <p className="text-sm text-muted-foreground">يجيب من مصادر المكتبة ويعرض المرجع وتاريخه</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning-soft px-3 py-1.5 text-xs font-medium text-[#7a4700]">
          <Info className="size-3.5" aria-hidden />
          معاينة: يعرض نتائج المكتبة فقط، ولم يُربط بنموذج لغوي بعد
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="space-y-5 rounded-2xl border border-border bg-card p-5 lg:self-start" aria-label="إعدادات المساعد">
          <div className="space-y-1.5">
            <Label htmlFor="ai-grade">سياق الصف</Label>
            <Select dir="rtl" value={gradeId ?? 'all'} onValueChange={(v) => setGradeId(v === 'all' ? undefined : v)}>
              <SelectTrigger id="ai-grade" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الصفوف</SelectItem>
                {grades.map((g) => (
                  <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">يبحث المساعد في مواد هذا الصف فقط.</p>
          </div>

          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-medium">وضع المذاكرة</legend>
            <div className="flex flex-wrap gap-1.5">
              {assistantModes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={mode === m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm transition-colors',
                    mode === m.id ? 'border-navy-900 bg-navy-900 text-white' : 'border-border hover:border-gold-500/60',
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="pt-1 text-xs leading-6 text-muted-foreground">{activeMode.hint}</p>
          </fieldset>

          <div className="space-y-2 rounded-xl bg-ivory p-3 text-xs leading-6 text-muted-foreground">
            <p className="flex items-center gap-1.5 font-semibold text-navy-900">
              <ShieldCheck className="size-4 text-success" aria-hidden />
              قواعد المساعد
            </p>
            <ul className="list-disc space-y-1 ps-4">
              <li>لا يختلق كتبًا أو قرارات أو مواعيد.</li>
              <li>يعرض المصدر ودرجة التحقق مع كل إجابة.</li>
              <li>يفرّق بين المعلومة الرسمية والشرح المولّد.</li>
              <li>يصرّح عندما لا تكفي الأدلة.</li>
            </ul>
          </div>
        </aside>

        <section className="flex min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-border bg-card" aria-label="المحادثة">
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6" aria-live="polite">
            {messages.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-accent text-gold-600">
                  <Bot className="size-8" aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-bold text-navy-900">
                  {grade ? `اسأل عن مواد ${grade.name}` : 'اسأل عن أي ملف أو موضوع دراسي'}
                </h2>
                <p className="mt-1 max-w-md text-sm leading-7 text-muted-foreground">
                  اكتب سؤالك بالفصحى أو بالعامية، وسأعرض المصادر المتاحة في المكتبة.
                </p>
                <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="rounded-xl border border-border bg-ivory px-4 py-3 text-start text-sm hover:border-gold-500/60"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className="flex justify-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-navy-800">
                    <User className="size-4" aria-hidden />
                  </span>
                  <p className="max-w-[85%] rounded-2xl rounded-ss-sm bg-navy-900 px-4 py-2.5 text-sm leading-7 text-white">
                    {m.text}
                  </p>
                </div>
              ) : (
                <AssistantBubble key={m.id} answer={m.answer} />
              ),
            )}

            {thinking && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground" role="status">
                <span className="grid size-8 place-items-center rounded-full bg-accent text-gold-600">
                  <Bot className="size-4" aria-hidden />
                </span>
                <span className="animate-pulse motion-reduce:animate-none">يبحث في المكتبة…</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(input)
            }}
            className="border-t border-border bg-ivory/60 p-3"
          >
            <Label htmlFor="ai-input" className="sr-only">سؤالك</Label>
            <div className="flex items-end gap-2 rounded-xl border border-input bg-card p-2 focus-within:border-gold-500">
              <Textarea
                id="ai-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    ask(input)
                  }
                }}
                maxLength={1000}
                rows={1}
                placeholder={`اكتب سؤالك — وضع ${activeMode.label}`}
                className="min-h-10 resize-none border-0 shadow-none focus-visible:ring-0"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || thinking} aria-label="إرسال">
                <ArrowUp />
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

function AssistantBubble({ answer }: { answer: PreviewAnswer }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-gold-600">
        {answer.kind === 'no-evidence' ? <SearchX className="size-4" aria-hidden /> : <Bot className="size-4" aria-hidden />}
      </span>
      <div className="min-w-0 flex-1 space-y-3">
        <p className="text-sm leading-7 text-ink">{answer.intro}</p>

        {answer.sources.length > 0 && (
          <ol className="space-y-2">
            {answer.sources.map((d, i) => {
              const Icon = documentTypeIcons[d.type]
              return (
                <li key={d.id}>
                  <Link
                    to="/library"
                    search={{ doc: d.id }}
                    className="flex items-start gap-3 rounded-xl border border-border bg-ivory p-3 hover:border-gold-500/60"
                  >
                    <span className="numerals grid size-6 shrink-0 place-items-center rounded-full bg-navy-900 text-xs text-gold-300">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 font-semibold text-navy-900">
                        <Icon className="size-4 text-gold-600" aria-hidden />
                        {d.title}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {documentTypeLabels[d.type]} · {getSource(d.sourceId)?.publisher.split('—')[0]} ·{' '}
                        {formatDate(d.publishedAt ?? d.discoveredAt)}
                        {d.pages ? ` · ${d.pages} صفحة` : ''}
                      </span>
                      <span className="mt-1.5 flex flex-wrap gap-1.5">
                        <VerificationBadge status={d.verification} />
                        <SampleTag />
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        )}

        {answer.events.length > 0 && (
          <ul className="space-y-2">
            {answer.events.map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-xl border border-border bg-ivory p-3 text-sm">
                <CalendarDays className="size-4 shrink-0 text-gold-600" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="font-semibold text-navy-900">{e.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {eventKindLabels[e.kind]} · {formatDate(e.date)} · المصدر: {e.sourceLabel}
                  </span>
                </span>
                <VerificationBadge status={e.verification} />
              </li>
            ))}
          </ul>
        )}

        {answer.note && (
          <p className="rounded-lg border-s-2 border-gold-500 bg-muted/60 px-3 py-2 text-xs leading-6 text-muted-foreground">
            {answer.note}
          </p>
        )}
      </div>
    </div>
  )
}
