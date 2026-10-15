import type {
  AccessMode,
  AnnouncementKind,
  DocumentType,
  EventKind,
  SourceKind,
  Term,
  VerificationStatus,
} from './types'

export const documentTypeLabels: Record<DocumentType, string> = {
  book: 'كتاب مدرسي',
  assessment: 'تقييم',
  model: 'نموذج استرشادي',
  exam: 'امتحان',
  guide: 'دليل المعلم',
  curriculum: 'منهج وتوزيع',
  video: 'شرح مرئي',
  link: 'رابط تعليمي',
}

export const verificationLabels: Record<
  VerificationStatus,
  { label: string; hint: string; tone: 'success' | 'warning' | 'muted' | 'danger' }
> = {
  verified: { label: 'موثّق', hint: 'تحقق النظام من المصدر والرابط.', tone: 'success' },
  pending: { label: 'قيد المراجعة', hint: 'اكتُشف حديثًا وينتظر مراجعة مسؤول.', tone: 'warning' },
  unverified: { label: 'يحتاج إلى التحقق', hint: 'لم يُتحقق من صحته بعد.', tone: 'warning' },
  outdated: { label: 'من سنة سابقة', hint: 'قد لا يطابق مواصفات العام الحالي.', tone: 'muted' },
  withdrawn: { label: 'مسحوب', hint: 'سُحب من العرض العام.', tone: 'danger' },
}

export const sourceKindLabels: Record<SourceKind, string> = {
  official: 'مصدر رسمي',
  educational: 'مصدر تعليمي خارجي',
  supporting: 'مادة مساعدة',
  ai: 'محتوى مولّد بالذكاء الاصطناعي',
}

export const accessLabels: Record<AccessMode, string> = {
  download: 'تنزيل',
  view: 'عرض',
  external: 'رابط خارجي',
}

export const termLabels: Record<Term, string> = {
  first: 'الفصل الدراسي الأول',
  second: 'الفصل الدراسي الثاني',
  'full-year': 'العام الدراسي كاملًا',
}

export const announcementKindLabels: Record<AnnouncementKind, string> = {
  official: 'إعلان رسمي',
  school: 'إعلان المدرسة',
  'needs-verification': 'يحتاج إلى التحقق',
}

export const eventKindLabels: Record<EventKind, string> = {
  exam: 'اختبار',
  assessment: 'تقييم',
  deadline: 'موعد تسليم',
  activity: 'فعالية',
}

const dateFmt = new Intl.DateTimeFormat('ar-EG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Africa/Cairo',
})

export function formatDate(iso?: string) {
  if (!iso) return 'غير متوفر'
  return dateFmt.format(new Date(`${iso}T12:00:00`))
}
