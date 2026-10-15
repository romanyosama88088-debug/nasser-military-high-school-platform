import { ExternalLink, Megaphone, Pin, TriangleAlert } from 'lucide-react'

import { SampleTag } from '@/components/library/status'
import { getGrade } from '@/data/fixtures'
import { announcementKindLabels, formatDate } from '@/data/labels'
import type { Announcement } from '@/data/types'
import { cn } from '@/lib/utils'

export function AnnouncementCard({ announcement: a }: { announcement: Announcement }) {
  const needsCheck = a.kind === 'needs-verification'
  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-xl border bg-card p-5',
        needsCheck ? 'border-warning/40' : 'border-border',
        a.pinned && 'border-s-4 border-s-gold-500',
      )}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium',
            needsCheck ? 'bg-warning-soft text-[#7a4700]' : 'bg-navy-900/5 text-navy-800',
          )}
        >
          {needsCheck ? <TriangleAlert className="size-3.5" aria-hidden /> : <Megaphone className="size-3.5" aria-hidden />}
          {announcementKindLabels[a.kind]}
        </span>
        {a.pinned && (
          <span className="inline-flex items-center gap-1 text-gold-600">
            <Pin className="size-3.5" aria-hidden />
            مثبّت
          </span>
        )}
        <SampleTag />
      </div>
      <h3 className="font-semibold leading-7 text-navy-900">{a.title}</h3>
      <p className="text-sm leading-7 text-muted-foreground">{a.body}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
        <span>
          {a.publisher} · {formatDate(a.publishedAt)}
        </span>
        {a.sourceUrl ? (
          <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-navy-700 hover:underline">
            <ExternalLink className="size-3.5" aria-hidden />
            رابط المصدر
          </a>
        ) : (
          <span>لا يوجد رابط تحقق بعد</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {a.gradeIds.length > 4 ? 'لكل الصفوف' : a.gradeIds.map((g) => getGrade(g)?.shortName).join('، ')}
      </p>
    </article>
  )
}
