/**
 * PREVIEW FIXTURES — the single place where sample content lives.
 *
 * Everything in this file is illustrative data used to show how the platform
 * presents content. It is NOT official school or ministry information: every
 * record carries `sample: true` and the UI labels it as such. Milestone 2
 * (see PLAN.md) replaces these exports with Netlify Database queries that
 * return the same types from `./types`.
 *
 * Only the two source base URLs below are real public addresses; individual
 * sample documents point at their source's home page, never at invented files.
 */
import type {
  AcademicSystem,
  Announcement,
  Grade,
  LibraryDocument,
  ScheduleEvent,
  Source,
  Subject,
} from './types'

export const CURRENT_YEAR = '2026–2027'
export const ACADEMIC_YEARS = ['2026–2027', '2025–2026'] as const

const MOE_URL = 'https://moe.gov.eg/'
const EKB_URL = 'https://www.ekb.eg/'

export const systems: AcademicSystem[] = [
  {
    id: 'baccalaureate',
    name: 'نظام البكالوريا المصرية',
    shortName: 'البكالوريا',
    description:
      'الصفان الثاني والثالث سنتا شهادة، والصف الأول سنة نقل.',
  },
  {
    id: 'general-secondary',
    name: 'الثانوية العامة',
    shortName: 'الثانوي العام',
    description:
      'الصف الثالث سنة الشهادة، والصفان الأول والثاني سنتا نقل.',
  },
]

export const grades: Grade[] = [
  {
    id: 'bac-2',
    name: 'الصف الثاني بكالوريا',
    shortName: 'ثانية بكالوريا',
    systemId: 'baccalaureate',
    stage: 'certificate',
    order: 1,
    active: true,
    summary: 'سنة شهادة: الكتب والتقييمات والنماذج ومواعيد الامتحانات.',
    lastUpdated: '2026-10-13',
  },
  {
    id: 'bac-3',
    name: 'الصف الثالث بكالوريا',
    shortName: 'ثالثة بكالوريا',
    systemId: 'baccalaureate',
    stage: 'certificate',
    order: 2,
    active: true,
    summary: 'سنة شهادة: مراجعات ونماذج استرشادية ومصادر رسمية.',
    lastUpdated: '2026-10-11',
  },
  {
    id: 'sec-3',
    name: 'الصف الثالث الثانوي',
    shortName: 'ثالثة ثانوي',
    systemId: 'general-secondary',
    stage: 'certificate',
    order: 3,
    active: true,
    summary: 'سنة الشهادة: النماذج والامتحانات السابقة والإعلانات.',
    lastUpdated: '2026-10-12',
  },
  {
    id: 'bac-1',
    name: 'الصف الأول بكالوريا',
    shortName: 'أولى بكالوريا',
    systemId: 'baccalaureate',
    stage: 'transfer',
    order: 4,
    active: true,
    summary: 'سنة نقل: الكتب والتقييمات الأسبوعية والجداول.',
    lastUpdated: '2026-10-09',
  },
  {
    id: 'sec-2',
    name: 'الصف الثاني الثانوي',
    shortName: 'ثانية ثانوي',
    systemId: 'general-secondary',
    stage: 'transfer',
    order: 5,
    active: true,
    summary: 'سنة نقل: الكتب والتقييمات ومواعيد الاختبارات.',
    lastUpdated: '2026-10-08',
  },
  {
    id: 'sec-1',
    name: 'الصف الأول الثانوي',
    shortName: 'أولى ثانوي',
    systemId: 'general-secondary',
    stage: 'transfer',
    order: 6,
    active: true,
    summary: 'سنة نقل: الكتب والتقييمات والنماذج.',
    lastUpdated: '2026-10-07',
  },
]

const ALL = grades.map((g) => g.id)
const BAC_UPPER = ['bac-2', 'bac-3']
const SCIENCE = ['bac-2', 'bac-3', 'sec-2', 'sec-3']

export const subjects: Subject[] = [
  { id: 'arabic', gradeIds: ALL, name: 'اللغة العربية', englishName: 'Arabic', icon: 'arabic' },
  { id: 'english', gradeIds: ALL, name: 'اللغة الإنجليزية', englishName: 'English', icon: 'english' },
  { id: 'math', gradeIds: ALL, name: 'الرياضيات', englishName: 'Mathematics', icon: 'math' },
  { id: 'physics', gradeIds: SCIENCE, name: 'الفيزياء', englishName: 'Physics', icon: 'physics' },
  { id: 'chemistry', gradeIds: SCIENCE, name: 'الكيمياء', englishName: 'Chemistry', icon: 'chemistry' },
  { id: 'biology', gradeIds: SCIENCE, name: 'الأحياء', englishName: 'Biology', icon: 'biology' },
  { id: 'integrated-science', gradeIds: ['bac-1', 'sec-1'], name: 'العلوم المتكاملة', englishName: 'Integrated Science', icon: 'science' },
  { id: 'history', gradeIds: ALL, name: 'التاريخ', englishName: 'History', icon: 'history' },
  { id: 'french', gradeIds: ['sec-1', 'sec-2', 'sec-3', 'bac-1'], name: 'اللغة الأجنبية الثانية', englishName: 'Second Foreign Language', icon: 'french' },
  { id: 'philosophy', gradeIds: ['sec-1', 'sec-2', 'sec-3'], name: 'الفلسفة والمنطق', englishName: 'Philosophy', icon: 'philosophy' },
  { id: 'religion', gradeIds: ALL, name: 'التربية الدينية', englishName: 'Religious Education', icon: 'religion' },
  { id: 'computer', gradeIds: ['bac-1', ...BAC_UPPER], name: 'البرمجة والحاسب', englishName: 'Programming', icon: 'computer' },
]

export const sources: Source[] = [
  {
    id: 'moe',
    name: 'الموقع الرسمي لوزارة التربية والتعليم والتعليم الفني',
    publisher: 'وزارة التربية والتعليم والتعليم الفني — جمهورية مصر العربية',
    baseUrl: MOE_URL,
    kind: 'official',
    status: 'listed',
    expectedContent: ['الكتب المدرسية', 'التقييمات', 'النماذج الاسترشادية', 'القرارات والإعلانات'],
    checkMethod: 'Sitemap وفحص دوري للصفحات العامة وفق robots.txt',
    frequency: 'كل 6 ساعات (قابل للضبط)',
    notes: 'المصدر الأهم للمنصة. يبدأ فحصه الآلي في مرحلة المزامنة بعد حصر الصفحات العامة التي تنشر الملفات.',
  },
  {
    id: 'ekb',
    name: 'بنك المعرفة المصري',
    publisher: 'بنك المعرفة المصري',
    baseUrl: EKB_URL,
    kind: 'official',
    status: 'listed',
    expectedContent: ['مصادر تعليمية', 'محتوى مرئي', 'مواد إثرائية'],
    checkMethod: 'روابط مرجعية يحددها المسؤول',
    frequency: 'أسبوعيًا (قابل للضبط)',
    notes: 'يُستخدم مرجعًا للمحتوى التعليمي، ولا يُعاد نشر ملفاته دون سند.',
  },
  {
    id: 'school',
    name: 'مصادر المدرسة المعتمدة',
    publisher: 'مدرسة ناصر الثانوية العسكرية بأسيوط',
    kind: 'official',
    status: 'awaiting-input',
    expectedContent: ['الإعلانات الداخلية', 'الجداول', 'مواعيد التقييمات'],
    checkMethod: 'إدخال من لوحة الإدارة بواسطة مسؤول مخوّل',
    frequency: 'عند النشر',
    notes: 'لم تُضف قنوات المدرسة الرسمية بعد.',
  },
  {
    id: 'platform',
    name: 'مواد مساعدة من فريق المنصة',
    publisher: 'فريق Nasser Military High School',
    kind: 'supporting',
    status: 'awaiting-input',
    expectedContent: ['ملخصات', 'أسئلة تدريبية'],
    checkMethod: 'إدخال يدوي مع مراجعة',
    frequency: 'عند النشر',
    notes: 'تُعرض دائمًا بوصفها «مادة مساعدة» لا مادة رسمية.',
  },
]

type DocSeed = Omit<LibraryDocument, 'sample' | 'systemId' | 'sourceUrl' | 'sourceKind'> & {
  sourceUrl?: string
}

function doc(seed: DocSeed): LibraryDocument {
  const grade = grades.find((g) => g.id === seed.gradeIds[0])
  const source = sources.find((s) => s.id === seed.sourceId)
  return {
    ...seed,
    systemId: grade?.systemId ?? 'general-secondary',
    sourceKind: source?.kind ?? 'educational',
    sourceUrl: seed.sourceUrl ?? source?.baseUrl ?? MOE_URL,
    sample: true,
  }
}

export const documents: LibraryDocument[] = [
  doc({
    id: 'bac2-physics-book-t1',
    title: 'كتاب الفيزياء — الفصل الدراسي الأول',
    description: 'الكتاب المدرسي للمادة بصيغة PDF، مقسم إلى وحدات مع أرقام الصفحات.',
    type: 'book', gradeIds: ['bac-2'], subjectId: 'physics', academicYear: CURRENT_YEAR, term: 'first',
    sourceId: 'moe', publishedAt: '2026-09-02', discoveredAt: '2026-09-02', lastCheckedAt: '2026-10-13',
    verification: 'verified', access: 'download', fileFormat: 'PDF', fileSizeMb: 24.6, pages: 212, version: 'الإصدار 1',
    keywords: ['فيزياء', 'كتاب', 'الكهربية', 'physics'],
  }),
  doc({
    id: 'bac2-math-assessment-w3',
    title: 'التقييم الأسبوعي الثالث — الرياضيات',
    description: 'تقييم أسبوعي مع نموذج الإجابة، منشور ضمن تقييمات الفصل الأول.',
    type: 'assessment', gradeIds: ['bac-2'], subjectId: 'math', academicYear: CURRENT_YEAR, term: 'first', unit: 'الأسبوع الثالث',
    sourceId: 'moe', publishedAt: '2026-10-11', discoveredAt: '2026-10-11', lastCheckedAt: '2026-10-13',
    verification: 'verified', access: 'download', fileFormat: 'PDF', fileSizeMb: 1.2, pages: 4,
    keywords: ['تقييم', 'رياضيات', 'أسبوعي', 'التفاضل'],
  }),
  doc({
    id: 'bac2-chem-model-1',
    title: 'نموذج استرشادي (1) — الكيمياء',
    description: 'نموذج امتحان استرشادي بأسئلة اختيار من متعدد وأسئلة مقالية.',
    type: 'model', gradeIds: ['bac-2'], subjectId: 'chemistry', academicYear: CURRENT_YEAR, term: 'first',
    sourceId: 'moe', publishedAt: '2026-10-06', discoveredAt: '2026-10-06', lastCheckedAt: '2026-10-12',
    verification: 'pending', access: 'view', fileFormat: 'PDF', fileSizeMb: 2.8, pages: 9,
    keywords: ['نموذج', 'كيمياء', 'استرشادي', 'امتحان'],
  }),
  doc({
    id: 'bac2-english-book-t1',
    title: 'English — Student Book, Term 1',
    description: 'كتاب الطالب للغة الإنجليزية، الفصل الدراسي الأول.',
    type: 'book', gradeIds: ['bac-2'], subjectId: 'english', academicYear: CURRENT_YEAR, term: 'first',
    sourceId: 'moe', publishedAt: '2026-09-01', discoveredAt: '2026-09-01', lastCheckedAt: '2026-10-13',
    verification: 'verified', access: 'download', fileFormat: 'PDF', fileSizeMb: 31.4, pages: 168,
    keywords: ['english', 'انجليزي', 'كتاب', 'student book'],
  }),
  doc({
    id: 'bac2-arabic-assessment-w2',
    title: 'التقييم الأسبوعي الثاني — اللغة العربية',
    description: 'تقييم أسبوعي في النحو والقراءة.',
    type: 'assessment', gradeIds: ['bac-2'], subjectId: 'arabic', academicYear: CURRENT_YEAR, term: 'first', unit: 'الأسبوع الثاني',
    sourceId: 'moe', publishedAt: '2026-10-04', discoveredAt: '2026-10-04', lastCheckedAt: '2026-10-12',
    verification: 'verified', access: 'download', fileFormat: 'PDF', fileSizeMb: 0.9, pages: 3,
    keywords: ['تقييم', 'عربي', 'نحو', 'أسبوعي'],
  }),
  doc({
    id: 'bac2-bio-curriculum',
    title: 'توزيع منهج الأحياء على الأسابيع',
    description: 'خطة توزيع الدروس على أسابيع الفصل الدراسي الأول.',
    type: 'curriculum', gradeIds: ['bac-2'], subjectId: 'biology', academicYear: CURRENT_YEAR, term: 'first',
    sourceId: 'moe', publishedAt: '2026-09-10', discoveredAt: '2026-09-10', lastCheckedAt: '2026-10-10',
    verification: 'verified', access: 'view', fileFormat: 'PDF', fileSizeMb: 0.4, pages: 2,
    keywords: ['توزيع منهج', 'أحياء', 'خطة', 'biology'],
  }),
  doc({
    id: 'bac3-math-model-2',
    title: 'نموذج استرشادي (2) — الرياضيات',
    description: 'نموذج تدريبي على شكل امتحان الشهادة.',
    type: 'model', gradeIds: ['bac-3'], subjectId: 'math', academicYear: CURRENT_YEAR, term: 'full-year',
    sourceId: 'moe', publishedAt: '2026-10-09', discoveredAt: '2026-10-09', lastCheckedAt: '2026-10-11',
    verification: 'verified', access: 'download', fileFormat: 'PDF', fileSizeMb: 1.9, pages: 8,
    keywords: ['نموذج', 'رياضيات', 'شهادة', 'استرشادي'],
  }),
  doc({
    id: 'bac3-physics-guide',
    title: 'دليل المعلم — الفيزياء',
    description: 'دليل المعلم المنشور للمادة، يتضمن أهداف الدروس وأنشطة مقترحة.',
    type: 'guide', gradeIds: ['bac-3'], subjectId: 'physics', academicYear: CURRENT_YEAR, term: 'full-year',
    sourceId: 'moe', publishedAt: '2026-09-15', discoveredAt: '2026-09-16', lastCheckedAt: '2026-10-11',
    verification: 'pending', access: 'external', fileFormat: 'PDF', fileSizeMb: 12.3, pages: 140,
    keywords: ['دليل المعلم', 'فيزياء', 'guide'],
  }),
  doc({
    id: 'sec3-chem-exam-2026',
    title: 'امتحان الكيمياء — الدور الأول 2026',
    description: 'امتحان شهادة سابق للاطلاع والتدريب.',
    type: 'exam', gradeIds: ['sec-3'], subjectId: 'chemistry', academicYear: '2025–2026', term: 'full-year',
    sourceId: 'moe', publishedAt: '2026-07-02', discoveredAt: '2026-07-02', lastCheckedAt: '2026-10-12',
    verification: 'verified', access: 'view', fileFormat: 'PDF', fileSizeMb: 1.6, pages: 6,
    keywords: ['امتحان', 'كيمياء', 'ثانوية عامة', 'سابق'],
  }),
  doc({
    id: 'sec3-physics-model-1',
    title: 'نموذج استرشادي (1) — الفيزياء',
    description: 'نموذج امتحان استرشادي للثانوية العامة.',
    type: 'model', gradeIds: ['sec-3'], subjectId: 'physics', academicYear: CURRENT_YEAR, term: 'full-year',
    sourceId: 'moe', publishedAt: '2026-10-10', discoveredAt: '2026-10-10', lastCheckedAt: '2026-10-12',
    verification: 'verified', access: 'download', fileFormat: 'PDF', fileSizeMb: 2.2, pages: 7,
    keywords: ['نموذج', 'فيزياء', 'ثانوية عامة'],
  }),
  doc({
    id: 'sec3-arabic-book',
    title: 'كتاب اللغة العربية — الثانوية العامة',
    description: 'الكتاب المدرسي للمادة.',
    type: 'book', gradeIds: ['sec-3'], subjectId: 'arabic', academicYear: CURRENT_YEAR, term: 'full-year',
    sourceId: 'moe', publishedAt: '2026-09-01', discoveredAt: '2026-09-01', lastCheckedAt: '2026-10-12',
    verification: 'verified', access: 'download', fileFormat: 'PDF', fileSizeMb: 18.1, pages: 196,
    keywords: ['كتاب', 'عربي', 'بلاغة', 'أدب'],
  }),
  doc({
    id: 'sec3-history-exam-2025',
    title: 'امتحان التاريخ — 2025',
    description: 'امتحان شهادة من سنة سابقة؛ قد يختلف عن مواصفات العام الحالي.',
    type: 'exam', gradeIds: ['sec-3'], subjectId: 'history', academicYear: '2025–2026', term: 'full-year',
    sourceId: 'moe', publishedAt: '2025-07-05', discoveredAt: '2025-07-06', lastCheckedAt: '2026-09-20',
    verification: 'outdated', access: 'view', fileFormat: 'PDF', fileSizeMb: 1.1, pages: 5,
    keywords: ['امتحان', 'تاريخ', 'سابق'],
  }),
  doc({
    id: 'bac1-science-assessment-w1',
    title: 'التقييم الأسبوعي الأول — العلوم المتكاملة',
    description: 'تقييم أسبوعي للصف الأول بكالوريا.',
    type: 'assessment', gradeIds: ['bac-1'], subjectId: 'integrated-science', academicYear: CURRENT_YEAR, term: 'first', unit: 'الأسبوع الأول',
    sourceId: 'moe', publishedAt: '2026-09-28', discoveredAt: '2026-09-28', lastCheckedAt: '2026-10-09',
    verification: 'verified', access: 'download', fileFormat: 'PDF', fileSizeMb: 0.8, pages: 3,
    keywords: ['تقييم', 'علوم متكاملة', 'أسبوعي'],
  }),
  doc({
    id: 'bac1-math-book',
    title: 'كتاب الرياضيات — الفصل الدراسي الأول',
    description: 'الكتاب المدرسي للمادة.',
    type: 'book', gradeIds: ['bac-1'], subjectId: 'math', academicYear: CURRENT_YEAR, term: 'first',
    sourceId: 'moe', publishedAt: '2026-09-01', discoveredAt: '2026-09-01', lastCheckedAt: '2026-10-09',
    verification: 'verified', access: 'download', fileFormat: 'PDF', fileSizeMb: 20.5, pages: 180,
    keywords: ['كتاب', 'رياضيات', 'جبر', 'هندسة'],
  }),
  doc({
    id: 'sec2-english-assessment-w2',
    title: 'Weekly Assessment 2 — English',
    description: 'تقييم أسبوعي للغة الإنجليزية للصف الثاني الثانوي.',
    type: 'assessment', gradeIds: ['sec-2'], subjectId: 'english', academicYear: CURRENT_YEAR, term: 'first', unit: 'Week 2',
    sourceId: 'moe', publishedAt: '2026-10-05', discoveredAt: '2026-10-05', lastCheckedAt: '2026-10-08',
    verification: 'verified', access: 'download', fileFormat: 'PDF', fileSizeMb: 0.7, pages: 3,
    keywords: ['assessment', 'english', 'تقييم', 'انجليزي'],
  }),
  doc({
    id: 'sec1-philosophy-book',
    title: 'كتاب الفلسفة والمنطق',
    description: 'الكتاب المدرسي للمادة.',
    type: 'book', gradeIds: ['sec-1'], subjectId: 'philosophy', academicYear: CURRENT_YEAR, term: 'first',
    sourceId: 'moe', publishedAt: '2026-09-01', discoveredAt: '2026-09-02', lastCheckedAt: '2026-10-07',
    verification: 'pending', access: 'external', fileFormat: 'PDF', fileSizeMb: 9.4, pages: 96,
    keywords: ['كتاب', 'فلسفة', 'منطق'],
  }),
  doc({
    id: 'ekb-physics-videos',
    title: 'شروحات مرئية في الفيزياء',
    description: 'مجموعة شروحات مرئية على بنك المعرفة المصري تخدم عدة صفوف.',
    type: 'video', gradeIds: ['bac-2', 'bac-3', 'sec-3'], subjectId: 'physics', academicYear: CURRENT_YEAR, term: 'full-year',
    sourceId: 'ekb', discoveredAt: '2026-09-20', lastCheckedAt: '2026-10-10',
    verification: 'verified', access: 'external', fileFormat: 'HTML',
    keywords: ['فيديو', 'شرح', 'فيزياء', 'بنك المعرفة'],
  }),
]

export const announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'نشر التقييمات الأسبوعية للصف الثاني بكالوريا',
    body: 'أُضيفت تقييمات الأسبوع الثالث لمواد الصف الثاني بكالوريا إلى المكتبة، مع نماذج الإجابة عند توفرها.',
    kind: 'official',
    publisher: 'وزارة التربية والتعليم والتعليم الفني',
    gradeIds: ['bac-2'],
    publishedAt: '2026-10-11',
    sourceUrl: MOE_URL,
    pinned: true,
    sample: true,
  },
  {
    id: 'ann-2',
    title: 'تحديث النماذج الاسترشادية لطلاب الشهادات',
    body: 'نماذج جديدة لطلاب الصفين الثاني والثالث بكالوريا والصف الثالث الثانوي.',
    kind: 'official',
    publisher: 'وزارة التربية والتعليم والتعليم الفني',
    gradeIds: ['bac-2', 'bac-3', 'sec-3'],
    publishedAt: '2026-10-09',
    sourceUrl: MOE_URL,
    sample: true,
  },
  {
    id: 'ann-3',
    title: 'تنبيه بشأن موعد تقييم شهر أكتوبر',
    body: 'تداولت صفحات غير رسمية موعدًا للتقييم الشهري. لم يُعتمد هذا الموعد بعد، وسيُحدَّث هنا عند صدوره من مصدر رسمي.',
    kind: 'needs-verification',
    publisher: 'فريق المنصة',
    gradeIds: ['sec-1', 'sec-2', 'bac-1'],
    publishedAt: '2026-10-08',
    sample: true,
  },
  {
    id: 'ann-4',
    title: 'إرشادات طلاب المنازل للفصل الدراسي الأول',
    body: 'تجميع لكل ما يحتاجه طالب المنازل: الكتب، والتقييمات المطلوبة، ومواعيد الامتحانات حال صدورها.',
    kind: 'school',
    publisher: 'مدرسة ناصر الثانوية العسكرية بأسيوط',
    gradeIds: ALL,
    publishedAt: '2026-10-05',
    sample: true,
  },
]

export const events: ScheduleEvent[] = [
  { id: 'ev-1', title: 'تسليم التقييم الأسبوعي الرابع', kind: 'deadline', gradeIds: ['bac-2'], date: '2026-10-18', sourceLabel: 'إعلان المدرسة', verification: 'verified', sample: true },
  { id: 'ev-2', title: 'اختبار شهر أكتوبر — الرياضيات', kind: 'exam', gradeIds: ['bac-2', 'bac-3'], subjectId: 'math', date: '2026-10-27', sourceLabel: 'بانتظار المصدر الرسمي', verification: 'pending', sample: true },
  { id: 'ev-3', title: 'التقييم الشهري — العلوم المتكاملة', kind: 'assessment', gradeIds: ['bac-1'], subjectId: 'integrated-science', date: '2026-10-29', sourceLabel: 'إعلان المدرسة', verification: 'verified', sample: true },
  { id: 'ev-4', title: 'يوم المراجعة المفتوح لطلاب الشهادات', kind: 'activity', gradeIds: ['bac-2', 'bac-3', 'sec-3'], date: '2026-11-05', sourceLabel: 'إعلان المدرسة', verification: 'verified', sample: true },
  { id: 'ev-5', title: 'اختبار شهر نوفمبر — اللغة الإنجليزية', kind: 'exam', gradeIds: ['sec-2', 'sec-3'], subjectId: 'english', date: '2026-11-24', sourceLabel: 'بانتظار المصدر الرسمي', verification: 'pending', sample: true },
]

/* ---------- Lookup helpers (become DB queries in milestone 2) ---------- */

export const getGrade = (id: string) => grades.find((g) => g.id === id)
export const getSubject = (id?: string) => subjects.find((s) => s.id === id)
export const getSource = (id: string) => sources.find((s) => s.id === id)
export const getSystem = (id: string) => systems.find((s) => s.id === id)

export const subjectsForGrade = (gradeId: string) =>
  subjects.filter((s) => s.gradeIds.includes(gradeId))

export const documentsForGrade = (gradeId: string) =>
  documents.filter((d) => d.gradeIds.includes(gradeId))

export const announcementsForGrade = (gradeId: string) =>
  announcements.filter((a) => a.gradeIds.includes(gradeId))

export const eventsForGrade = (gradeId: string) =>
  events.filter((e) => e.gradeIds.includes(gradeId))

export const latestDocuments = (limit = 6) =>
  [...documents]
    .filter((d) => d.verification === 'verified' && d.academicYear === CURRENT_YEAR)
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    .slice(0, limit)
