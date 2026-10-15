import { Link } from '@tanstack/react-router'
import { ArrowLeft, Award } from 'lucide-react'

import { documentsForGrade, getSystem } from '@/data/fixtures'
import type { Grade } from '@/data/types'
import { cn } from '@/lib/utils'

export function GradeCard({ grade, className }: { grade: Grade; className?: string }) {
  const certificate = grade.stage === 'certificate'
  const count = documentsForGrade(grade.id).length
  return (
    <Link
      to="/grades/$gradeId"
      params={{ gradeId: grade.id }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-[border-color,transform] hover:-translate-y-0.5 motion-reduce:transform-none',
        certificate
          ? 'border-gold-500/40 bg-navy-900 text-white hover:border-gold-300'
          : 'border-border bg-card text-ink hover:border-gold-500/60',
        className,
      )}
    >
      {certificate && <div className="pattern-girih absolute inset-0 opacity-[0.07]" aria-hidden />}
      <div className="relative flex items-center justify-between gap-2">
        <span className={cn('text-xs', certificate ? 'text-gold-300' : 'text-gold-600')}>
          {getSystem(grade.systemId)?.shortName}
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
            certificate ? 'bg-gold-500 text-navy-950' : 'bg-secondary text-navy-800',
          )}
        >
          {certificate && <Award className="size-3.5" aria-hidden />}
          {certificate ? 'سنة شهادة' : 'سنة نقل'}
        </span>
      </div>
      <h3 className={cn('relative mt-4 text-xl font-bold', certificate ? 'text-white' : 'text-navy-900')}>
        {grade.name}
      </h3>
      <p className={cn('relative mt-2 text-sm leading-7', certificate ? 'text-white/70' : 'text-muted-foreground')}>
        {grade.summary}
      </p>
      <div
        className={cn(
          'relative mt-5 flex items-center justify-between border-t pt-3 text-sm',
          certificate ? 'border-white/10' : 'border-border',
        )}
      >
        <span className={cn('numerals', certificate ? 'text-white/60' : 'text-muted-foreground')}>
          {count} {count === 1 ? 'ملف' : 'ملفات'} في المكتبة
        </span>
        <span className={cn('inline-flex items-center gap-1 font-semibold', certificate ? 'text-gold-300' : 'text-navy-800')}>
          ادخل
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 motion-reduce:transform-none" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
