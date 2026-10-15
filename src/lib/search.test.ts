import { describe, expect, it } from 'vitest'
import { documents } from '@/data/fixtures'
import { normalizeArabic, searchDocuments, tokenize } from './search'

describe('normalizeArabic', () => {
  it('removes diacritics and unifies letter forms', () => {
    expect(normalizeArabic('الرِّياضيّات')).toBe('الرياضيات')
    expect(normalizeArabic('أحياء')).toBe('احياء')
    expect(normalizeArabic('مكتبة')).toBe('مكتبه')
    expect(normalizeArabic('نموذج ٣')).toBe('نموذج 3')
  })
})

describe('tokenize', () => {
  it('expands colloquial spellings', () => {
    expect(tokenize('رياضة')).toContain('رياضيات')
  })
})

describe('searchDocuments', () => {
  it('finds documents by subject with an alternative spelling', () => {
    const hits = searchDocuments(documents, 'تقييم رياضه')
    expect(hits[0].doc.subjectId).toBe('math')
    expect(hits[0].doc.type).toBe('assessment')
  })

  it('respects grade and type filters', () => {
    const hits = searchDocuments(documents, '', { grade: 'bac-2', type: 'book' })
    expect(hits.length).toBeGreaterThan(0)
    expect(hits.every((h) => h.doc.gradeIds.includes('bac-2'))).toBe(true)
    expect(hits.every((h) => h.doc.type === 'book')).toBe(true)
  })

  it('returns nothing for unrelated queries instead of guessing', () => {
    expect(searchDocuments(documents, 'كرة القدم')).toHaveLength(0)
  })

  it('ranks verified files above outdated ones for the same query', () => {
    const hits = searchDocuments(documents, 'امتحان', { grade: 'sec-3' })
    const outdated = hits.findIndex((h) => h.doc.verification === 'outdated')
    expect(outdated).toBeGreaterThan(0)
  })
})

describe('answerPreview', () => {
  it('declines instead of guessing when no source matches', async () => {
    const { answerPreview } = await import('./assistant-preview')
    const a = answerPreview('ما عاصمة المريخ؟', 'explain')
    expect(a.kind).toBe('no-evidence')
    expect(a.sources).toHaveLength(0)
  })

  it('answers date questions from the schedule only', async () => {
    const { answerPreview } = await import('./assistant-preview')
    const a = answerPreview('امتى امتحان الرياضيات؟', 'search', 'bac-2')
    expect(a.kind).toBe('schedule')
    expect(a.events.every((e) => e.gradeIds.includes('bac-2'))).toBe(true)
  })

  it('keeps retrieval inside the selected grade', async () => {
    const { answerPreview } = await import('./assistant-preview')
    const a = answerPreview('نموذج فيزياء', 'search', 'sec-3')
    expect(a.sources.length).toBeGreaterThan(0)
    expect(a.sources.every((d) => d.gradeIds.includes('sec-3'))).toBe(true)
  })
})

describe('stop words', () => {
  it('ignores conversational filler', () => {
    expect(tokenize('اشرح لي قانون أوم')).toEqual(['قانون', 'اوم'])
  })
})
