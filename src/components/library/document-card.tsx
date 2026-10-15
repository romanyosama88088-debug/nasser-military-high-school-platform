import { CalendarDays } from 'lucide-react'

import { getGrade, getSource, getSubject } from '@/data/fixtures'
import { documentTypeLabels, formatDate } from '@/data/labels'
import type { LibraryDocument } from '@/data/types'
import { cn } from '@/lib/utils'
import { documentTypeIcons, SampleTag, VerificationBadge } from './status'

export function DocumentCard({
  doc,
  onOpen,
  className,
  style,
}: {
  doc: LibraryDocument
  onOpen: (doc: LibraryDocument) => void
  className?: string
  style?: React.CSSProperties
}) {
  const Icon = documentTypeIcons[doc.type]
  const subject = getSubject(doc.subjectId)
  const source = getSource(doc.sourceId)

  return (
    <article
      style={style}
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-[border-color,box-shadow] hover:border-gold-500/60 hover:shadow-[0_6px_24px_-12px_rgba(8,21,46,0.35)] motion-reduce:transition-none',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-navy-900 text-gold-300">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gold-600">
            {documentTypeLabels[doc.type]}
            {subject && <> · {subject.name}</>}
          </p>
          <h3 className="mt-0.5 text-[0.98rem] leading-7 font-semibold text-navy-900">
            <button
              type="button"
              onClick={() => onOpen(doc)}
              className="text-start after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none group-focus-within:underline"
            >
              {doc.title}
            </button>
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {doc.gradeIds.map((g) => (
          <span key={g} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-navy-800">
            {getGrade(g)?.shortName}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3.5" aria-hidden />
          {formatDate(doc.publishedAt ?? doc.discoveredAt)}
          <span aria-hidden>·</span>
          <span className="truncate">{source?.publisher.split('—')[0]}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <VerificationBadge status={doc.verification} />
          <SampleTag />
        </span>
      </div>
    </article>
  )
}
