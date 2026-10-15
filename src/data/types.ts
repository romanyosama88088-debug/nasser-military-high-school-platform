/**
 * Content model for the platform. These types mirror the planned database
 * entities (see PLAN.md) so the fixtures can later be swapped for real
 * queries without touching the UI components.
 */

export type AcademicSystemId = 'baccalaureate' | 'general-secondary'

export interface AcademicSystem {
  id: AcademicSystemId
  name: string
  shortName: string
  description: string
}

export type GradeStage = 'transfer' | 'certificate'

export interface Grade {
  id: string
  name: string
  shortName: string
  systemId: AcademicSystemId
  stage: GradeStage
  order: number
  active: boolean
  /** Short, factual description of what the space contains. */
  summary: string
  lastUpdated: string
}

export interface Subject {
  id: string
  gradeIds: string[]
  name: string
  englishName?: string
  icon: SubjectIcon
  description?: string
}

export type SubjectIcon =
  | 'arabic'
  | 'english'
  | 'math'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'history'
  | 'geography'
  | 'philosophy'
  | 'religion'
  | 'french'
  | 'computer'
  | 'civics'
  | 'science'

export type DocumentType =
  | 'book'
  | 'assessment'
  | 'model'
  | 'exam'
  | 'guide'
  | 'curriculum'
  | 'video'
  | 'link'

export type VerificationStatus =
  | 'verified'
  | 'pending'
  | 'unverified'
  | 'outdated'
  | 'withdrawn'

export type SourceKind = 'official' | 'educational' | 'supporting' | 'ai'

export type AccessMode = 'download' | 'view' | 'external'

export type Term = 'first' | 'second' | 'full-year'

export interface LibraryDocument {
  id: string
  title: string
  description: string
  type: DocumentType
  gradeIds: string[]
  subjectId?: string
  systemId: AcademicSystemId
  academicYear: string
  term: Term
  unit?: string
  sourceId: string
  sourceKind: SourceKind
  sourceUrl: string
  publishedAt?: string
  discoveredAt: string
  lastCheckedAt: string
  verification: VerificationStatus
  access: AccessMode
  fileFormat?: 'PDF' | 'DOCX' | 'PPTX' | 'HTML' | 'MP4'
  fileSizeMb?: number
  pages?: number
  version?: string
  keywords: string[]
  /** Marks preview data that is not real school/ministry content. */
  sample: true
}

export type AnnouncementKind = 'official' | 'school' | 'needs-verification'

export interface Announcement {
  id: string
  title: string
  body: string
  kind: AnnouncementKind
  publisher: string
  gradeIds: string[]
  publishedAt: string
  effectiveFrom?: string
  expiresAt?: string
  sourceUrl?: string
  pinned?: boolean
  sample: true
}

export type EventKind = 'exam' | 'assessment' | 'deadline' | 'activity'

export interface ScheduleEvent {
  id: string
  title: string
  kind: EventKind
  gradeIds: string[]
  subjectId?: string
  date: string
  sourceLabel: string
  verification: VerificationStatus
  sample: true
}

export type SourceStatus = 'listed' | 'monitoring' | 'awaiting-input'

export interface Source {
  id: string
  name: string
  publisher: string
  baseUrl?: string
  kind: SourceKind
  status: SourceStatus
  expectedContent: string[]
  checkMethod: string
  frequency: string
  notes: string
}
