/**
 * Retrieval-only assistant used until the language model is connected
 * (milestone 4 in PLAN.md). It never generates claims: it returns the library
 * documents and schedule entries that match the question, or says plainly
 * that nothing supports an answer.
 */
import { documents, eventsForGrade, getGrade } from '@/data/fixtures'
import type { LibraryDocument, ScheduleEvent } from '@/data/types'
import { normalizeArabic, searchDocuments } from './search'

export type AssistantMode =
  | 'explain'
  | 'quiz'
  | 'summarize'
  | 'search'
  | 'review'
  | 'recall'
  | 'mistakes'
  | 'document'

export const assistantModes: { id: AssistantMode; label: string; hint: string }[] = [
  { id: 'explain', label: 'الشرح', hint: 'يشرح المفهوم بالتدرج مع أمثلة مناسبة لمستواك.' },
  { id: 'search', label: 'البحث', hint: 'يبحث في المكتبة والمصادر ويعرض النتائج.' },
  { id: 'quiz', label: 'الاختبار', hint: 'ينشئ أسئلة تدريبية ثم يصحح ويفسر.' },
  { id: 'summarize', label: 'التلخيص', hint: 'يلخص مصدرًا محددًا مع الحفاظ على النقاط المهمة.' },
  { id: 'review', label: 'المراجعة', hint: 'يساعدك على مراجعة وحدة أو موضوع.' },
  { id: 'recall', label: 'الاستذكار النشط', hint: 'يسألك سؤالًا واحدًا وينتظر إجابتك.' },
  { id: 'mistakes', label: 'تحليل الأخطاء', hint: 'يساعدك على فهم سبب الخطأ.' },
  { id: 'document', label: 'فهم مستند', hint: 'اختر ملفًا واسأل عن محتواه.' },
]

export interface PreviewAnswer {
  kind: 'sources' | 'no-evidence' | 'schedule'
  intro: string
  sources: LibraryDocument[]
  events: ScheduleEvent[]
  note?: string
}

const DATE_INTENT = ['موعد', 'امتي', 'متي', 'تاريخ', 'جدول', 'ميعاد'].map(normalizeArabic)

export function answerPreview(question: string, mode: AssistantMode, gradeId?: string): PreviewAnswer {
  const q = normalizeArabic(question)
  const grade = gradeId ? getGrade(gradeId) : undefined

  if (DATE_INTENT.some((w) => q.includes(w))) {
    const events = gradeId ? eventsForGrade(gradeId) : []
    return {
      kind: 'schedule',
      intro: events.length
        ? `هذه المواعيد المسجلة ${grade ? `لـ${grade.name}` : ''} مع حالة التحقق من كل منها:`
        : 'لا أستنتج مواعيد الامتحانات أو التقييمات من الذاكرة. لا يوجد موعد مسجل يطابق سؤالك.',
      sources: [],
      events,
      note: grade
        ? 'الموعد «قيد المراجعة» لم يصدر من مصدر رسمي بعد. تحقق من صفحة الوزارة أو إعلان المدرسة.'
        : 'اختر صفك من الإعدادات لأعرض مواعيده المسجلة.',
    }
  }

  const hits = searchDocuments(documents, question, { grade: gradeId }).slice(0, 4)
  if (hits.length === 0) {
    return {
      kind: 'no-evidence',
      intro: 'لم أجد في المكتبة مصدرًا يدعم إجابة عن هذا السؤال، ولن أخمّن إجابة وأنسبها إلى مصدر رسمي.',
      sources: [],
      events: [],
      note: 'جرّب صياغة أخرى، أو ابحث في الموقع الرسمي لوزارة التربية والتعليم. إذا كان الملف منشورًا ولم نضفه بعد، سيظهر هنا بعد مراجعته.',
    }
  }

  const modeNote: Partial<Record<AssistantMode, string>> = {
    explain: 'بعد تفعيل النموذج اللغوي، سيشرح المساعد المفهوم من هذه المصادر مع ذكر الصفحة.',
    quiz: 'بعد تفعيل النموذج اللغوي، ستُبنى الأسئلة التدريبية من هذه المصادر وتُعلَّم بأنها «مولّدة بالذكاء الاصطناعي».',
    summarize: 'بعد تفعيل النموذج اللغوي، سيُلخَّص المصدر الذي تختاره مع الإشارة إلى أرقام الصفحات.',
  }

  return {
    kind: 'sources',
    intro: `وجدت ${hits.length === 1 ? 'مصدرًا واحدًا' : `${hits.length} مصادر`} في المكتبة ${grade ? `ضمن ${grade.name} ` : ''}قد ترتبط بسؤالك:`,
    sources: hits.map((h) => h.doc),
    events: [],
    note: modeNote[mode],
  }
}
