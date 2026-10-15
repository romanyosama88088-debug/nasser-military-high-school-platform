import type { ScheduleEvent } from '@/data/types'

const escape = (s: string) => s.replace(/[\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')

/** Builds an all-day iCalendar file so students can add dates to any calendar app. */
export function buildIcs(events: ScheduleEvent[], calendarName: string) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nasser Military High School//Schedule//AR',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${escape(calendarName)}`,
  ]
  for (const e of events) {
    const day = e.date.replace(/-/g, '')
    const next = new Date(`${e.date}T00:00:00Z`)
    next.setUTCDate(next.getUTCDate() + 1)
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.id}@nasser-military-platform`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${day}`,
      `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replace(/-/g, '')}`,
      `SUMMARY:${escape(e.title)}`,
      `DESCRIPTION:${escape(`المصدر: ${e.sourceLabel}`)}`,
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export function downloadIcs(events: ScheduleEvent[], calendarName: string, filename: string) {
  const blob = new Blob([buildIcs(events, calendarName)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
