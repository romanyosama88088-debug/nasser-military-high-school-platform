import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: LucideIcon
  title: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/60 px-6 py-10 text-center',
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-accent text-gold-600">
        <Icon className="size-6" aria-hidden />
      </span>
      <p className="font-display text-base font-semibold text-navy-900">{title}</p>
      {children && <div className="max-w-md text-sm leading-7 text-muted-foreground">{children}</div>}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  action,
  id,
}: {
  eyebrow?: string
  title: string
  action?: React.ReactNode
  id?: string
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="mb-1 text-sm font-medium text-gold-600">{eyebrow}</p>}
        <h2 id={id} className="text-2xl font-bold text-navy-900 sm:text-[1.7rem]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}
