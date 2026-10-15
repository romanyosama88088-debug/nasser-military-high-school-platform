import { getGrade, getSubject } from '@/data/fixtures'
import { documentTypeLabels } from '@/data/labels'
import type {
  DocumentType,
  LibraryDocument,
  Term,
  VerificationStatus,
} from '@/data/types'

/**
 * Normalizes Arabic text for matching: strips diacritics and tatweel,
 * unifies alef/ya/ta-marbuta forms, converts Arabic-Indic digits.
 */
export function normalizeArabic(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ً-ْٰـ]/g, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const STOP_WORDS = new Set(
  [
    'في', 'من', 'على', 'الى', 'عن', 'ما', 'هو', 'هي', 'او', 'و', 'ال', 'لي', 'لك', 'انا',
    'اين', 'فين', 'ايه', 'اجد', 'عايز', 'عاوز', 'ممكن', 'اريد', 'اشرح', 'هل', 'كيف',
    'the', 'of', 'a', 'is', 'what', 'where',
  ].map(
    normalizeArabic,
  ),
)

/** Common alternative spellings and colloquial terms students type. */
const SYNONYMS: Record<string, string[]> = {
  رياضه: ['رياضيات', 'math'],
  ماث: ['رياضيات', 'math'],
  انجليزي: ['english', 'الانجليزيه'],
  انجلش: ['english'],
  عربي: ['العربيه'],
  فيزيا: ['فيزياء', 'physics'],
  كيميا: ['كيمياء', 'chemistry'],
  احيا: ['احياء', 'biology'],
  تقييمات: ['تقييم'],
  نماذج: ['نموذج'],
  امتحانات: ['امتحان'],
  كتب: ['كتاب'],
  منهج: ['منهج', 'توزيع'],
  بكالوريا: ['بكالوريا'],
  تانيه: ['الثاني', 'ثانيه'],
  تالته: ['الثالث', 'ثالثه'],
}

export function tokenize(query: string): string[] {
  const words = normalizeArabic(query)
    .split(' ')
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w))
  const expanded = new Set<string>()
  for (const w of words) {
    expanded.add(w)
    // Arabic definite article "ال" — match with or without it.
    if (w.startsWith('ال') && w.length > 3) expanded.add(w.slice(2))
    for (const syn of SYNONYMS[w] ?? []) expanded.add(normalizeArabic(syn))
  }
  return [...expanded]
}

export interface SearchFilters {
  grade?: string
  subject?: string
  type?: DocumentType
  year?: string
  term?: Term
  verification?: VerificationStatus
}

export interface SearchHit {
  doc: LibraryDocument
  score: number
}

function fields(doc: LibraryDocument) {
  const subject = getSubject(doc.subjectId)
  return {
    title: normalizeArabic(doc.title),
    keywords: normalizeArabic(doc.keywords.join(' ')),
    meta: normalizeArabic(
      [
        subject?.name,
        subject?.englishName,
        documentTypeLabels[doc.type],
        ...doc.gradeIds.map((g) => getGrade(g)?.name ?? ''),
        doc.unit,
      ].join(' '),
    ),
    description: normalizeArabic(doc.description),
  }
}

const VERIFICATION_WEIGHT: Record<VerificationStatus, number> = {
  verified: 1,
  pending: 0.8,
  unverified: 0.6,
  outdated: 0.5,
  withdrawn: 0,
}

/**
 * Lexical search with field weights. Relevance comes first; verification
 * and source trust adjust the score, and recency only breaks ties so a stable
 * official book can outrank a newer but unrelated file.
 */
export function searchDocuments(
  docs: LibraryDocument[],
  query: string,
  filters: SearchFilters = {},
): SearchHit[] {
  const tokens = tokenize(query)
  const filtered = docs.filter(
    (d) =>
      d.verification !== 'withdrawn' &&
      (!filters.grade || d.gradeIds.includes(filters.grade)) &&
      (!filters.subject || d.subjectId === filters.subject) &&
      (!filters.type || d.type === filters.type) &&
      (!filters.year || d.academicYear === filters.year) &&
      (!filters.term || d.term === filters.term) &&
      (!filters.verification || d.verification === filters.verification),
  )

  const hits: SearchHit[] = []
  for (const doc of filtered) {
    let score = 1
    if (tokens.length) {
      const f = fields(doc)
      let matched = 0
      score = 0
      for (const t of tokens) {
        let s = 0
        if (f.title.includes(t)) s += 5
        if (f.keywords.includes(t)) s += 3
        if (f.meta.includes(t)) s += 2
        if (f.description.includes(t)) s += 1
        if (s > 0) matched++
        score += s
      }
      if (matched === 0) continue
      score *= 0.5 + matched / tokens.length
    }
    score *= VERIFICATION_WEIGHT[doc.verification]
    if (doc.sourceKind === 'official') score *= 1.15
    hits.push({ doc, score })
  }

  return hits.sort(
    (a, b) =>
      b.score - a.score ||
      (b.doc.publishedAt ?? b.doc.discoveredAt).localeCompare(
        a.doc.publishedAt ?? a.doc.discoveredAt,
      ),
  )
}
