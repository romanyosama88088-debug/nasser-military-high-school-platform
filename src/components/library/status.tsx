import {
  Atom,
  BookOpen,
  Brain,
  CircleAlert,
  CircleCheck,
  ClipboardCheck,
  Clock,
  Code,
  Dna,
  Feather,
  FileText,
  FlaskConical,
  Globe,
  Landmark,
  Languages,
  Link as LinkIcon,
  Microscope,
  Moon,
  Scale,
  ScrollText,
  Sigma,
  Archive,
  Video,
  type LucideIcon,
} from 'lucide-react'

import { verificationLabels, sourceKindLabels } from '@/data/labels'
import type { DocumentType, SourceKind, SubjectIcon, VerificationStatus } from '@/data/types'
import { cn } from '@/lib/utils'

export const subjectIcons: Record<SubjectIcon, LucideIcon> = {
  arabic: Feather,
  english: Languages,
  french: Globe,
  math: Sigma,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Dna,
  science: Microscope,
  history: Landmark,
  geography: Globe,
  philosophy: Brain,
  religion: Moon,
  computer: Code,
  civics: Scale,
}

export const documentTypeIcons: Record<DocumentType, LucideIcon> = {
  book: BookOpen,
  assessment: ClipboardCheck,
  model: FileText,
  exam: ScrollText,
  guide: BookOpen,
  curriculum: ScrollText,
  video: Video,
  link: LinkIcon,
}

const toneClass = {
  success: 'bg-success-soft text-success border-success/25',
  warning: 'bg-warning-soft text-[#7a4700] border-warning/30',
  muted: 'bg-muted text-muted-foreground border-border',
  danger: 'bg-danger-soft text-danger border-danger/25',
} as const

const toneIcon = {
  success: CircleCheck,
  warning: Clock,
  muted: Archive,
  danger: CircleAlert,
} as const

/** Status is always conveyed by icon + text, never by color alone. */
export function VerificationBadge({
  status,
  className,
}: {
  status: VerificationStatus
  className?: string
}) {
  const v = verificationLabels[status]
  const Icon = toneIcon[v.tone]
  return (
    <span
      title={v.hint}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        toneClass[v.tone],
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {v.label}
    </span>
  )
}

export function SourceKindBadge({ kind }: { kind: SourceKind }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs',
        kind === 'official'
          ? 'border-navy-800/20 bg-navy-900/5 text-navy-800'
          : 'border-border bg-card text-muted-foreground',
      )}
    >
      {sourceKindLabels[kind]}
    </span>
  )
}

export function SampleTag() {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-warning/50 px-2 py-0.5 text-[0.7rem] text-[#7a4700]">
      مثال توضيحي
    </span>
  )
}
