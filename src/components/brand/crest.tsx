import { cn } from '@/lib/utils'

/**
 * Interim brand mark: shield, open book, torch, and eight-point star.
 * Text is never baked into the mark — names are set in real fonts beside it.
 * To replace with the school's official emblem, swap this component's SVG
 * (and public/favicon.svg) without touching any page.
 */
export function Crest({
  className,
  title = 'شعار Nasser Military High School',
}: {
  className?: string
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 64 72"
      role="img"
      aria-label={title}
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id="crest-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E2C47A" />
          <stop offset="1" stopColor="#B38E48" />
        </linearGradient>
      </defs>
      <path
        d="M32 2 L60 10 V34 C60 52 47 64 32 70 C17 64 4 52 4 34 V10 Z"
        fill="#102447"
        stroke="url(#crest-gold)"
        strokeWidth="2.5"
      />
      <path
        d="M32 7 L55 13.5 V34 C55 49 44.5 59 32 64.5 C19.5 59 9 49 9 34 V13.5 Z"
        fill="none"
        stroke="#C9A45B"
        strokeOpacity="0.45"
        strokeWidth="0.8"
      />
      {/* eight-point star */}
      <g transform="translate(32 21)" fill="none" stroke="url(#crest-gold)" strokeWidth="1.2">
        <rect x="-6" y="-6" width="12" height="12" />
        <rect x="-6" y="-6" width="12" height="12" transform="rotate(45)" />
      </g>
      {/* torch flame */}
      <path
        d="M32 15.5 C34.5 18.5 34.2 20.6 32 22.8 C29.8 20.6 29.5 18.5 32 15.5 Z"
        fill="url(#crest-gold)"
      />
      <path d="M30.6 23.5 H33.4 L32.8 33 H31.2 Z" fill="url(#crest-gold)" />
      {/* open book */}
      <path
        d="M32 38 C27 35 20 35 15 36.5 V50 C20 48.5 27 48.5 32 51.5 C37 48.5 44 48.5 49 50 V36.5 C44 35 37 35 32 38 Z"
        fill="#F7F4EC"
        stroke="url(#crest-gold)"
        strokeWidth="1.4"
      />
      <path d="M32 38 V51.5" stroke="#C9A45B" strokeWidth="1.2" />
      <path
        d="M19 40 C23 39.4 27 39.6 29.5 40.8 M19 43.5 C23 42.9 27 43.1 29.5 44.3 M34.5 40.8 C37 39.6 41 39.4 45 40 M34.5 44.3 C37 43.1 41 42.9 45 43.5"
        stroke="#18345A"
        strokeOpacity="0.5"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  )
}

export function Wordmark({
  className,
  tone = 'dark',
}: {
  className?: string
  tone?: 'dark' | 'light'
}) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <Crest className="h-10 w-9" />
      <span className="flex flex-col leading-tight" dir="ltr">
        <span
          className={cn(
            'font-brand text-[0.95rem] font-semibold tracking-wide',
            tone === 'dark' ? 'text-white' : 'text-navy-900',
          )}
        >
          Nasser Military High School
        </span>
        <span
          dir="rtl"
          className={cn(
            'text-end text-[0.72rem]',
            tone === 'dark' ? 'text-gold-300' : 'text-gold-600',
          )}
        >
          مدرسة ناصر الثانوية العسكرية بأسيوط
        </span>
      </span>
    </span>
  )
}
