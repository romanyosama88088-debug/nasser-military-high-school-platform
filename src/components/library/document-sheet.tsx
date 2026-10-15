import { Copy, Download, ExternalLink, Eye, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { getGrade, getSource, getSubject, getSystem } from '@/data/fixtures'
import {
  accessLabels,
  documentTypeLabels,
  formatDate,
  termLabels,
  verificationLabels,
} from '@/data/labels'
import type { LibraryDocument } from '@/data/types'
import { SampleTag, SourceKindBadge, VerificationBadge } from './status'

export function DocumentSheet({
  doc,
  onOpenChange,
}: {
  doc: LibraryDocument | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={doc !== null} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-lg">
        {doc && <DocumentDetail doc={doc} />}
      </SheetContent>
    </Sheet>
  )
}

function DocumentDetail({ doc }: { doc: LibraryDocument }) {
  const subject = getSubject(doc.subjectId)
  const source = getSource(doc.sourceId)
  const system = getSystem(doc.systemId)

  const rows: [string, React.ReactNode][] = [
    ['نوع المحتوى', documentTypeLabels[doc.type]],
    ['الصف', doc.gradeIds.map((g) => getGrade(g)?.name).join('، ')],
    ['النظام الدراسي', system?.name],
    ['المادة', subject?.name ?? 'عام'],
    ['السنة الدراسية', <span className="numerals" dir="ltr">{doc.academicYear}</span>],
    ['الفصل الدراسي', termLabels[doc.term]],
    ...(doc.unit ? ([['الوحدة / الأسبوع', doc.unit]] as [string, React.ReactNode][]) : []),
    ['الجهة الناشرة', source?.publisher],
    ['تاريخ النشر', formatDate(doc.publishedAt)],
    ['تاريخ الاكتشاف', formatDate(doc.discoveredAt)],
    ['آخر تحقق', formatDate(doc.lastCheckedAt)],
    ['طريقة الإتاحة', accessLabels[doc.access]],
    ...(doc.fileFormat
      ? ([[
          'الملف',
          <span dir="ltr" className="numerals">
            {doc.fileFormat}
            {doc.fileSizeMb ? ` · ${doc.fileSizeMb} MB` : ''}
            {doc.pages ? ` · ${doc.pages} صفحة` : ''}
          </span>,
        ]] as [string, React.ReactNode][])
      : []),
    ...(doc.version ? ([['الإصدار', doc.version]] as [string, React.ReactNode][]) : []),
  ]

  async function copyLink() {
    const url = `${window.location.origin}/library?doc=${doc.id}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('نُسخ رابط الملف')
    } catch {
      toast.error('تعذر نسخ الرابط، انسخه من شريط العنوان')
    }
  }

  return (
    <>
      <SheetHeader className="border-b border-border bg-ivory pe-12">
        <div className="flex flex-wrap gap-1.5">
          <VerificationBadge status={doc.verification} />
          <SourceKindBadge kind={doc.sourceKind} />
          <SampleTag />
        </div>
        <SheetTitle className="font-display text-lg leading-8 text-navy-900">{doc.title}</SheetTitle>
        <SheetDescription className="leading-7">{doc.description}</SheetDescription>
      </SheetHeader>

      <div className="space-y-6 p-4">
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          {verificationLabels[doc.verification].hint}
        </p>

        <dl className="divide-y divide-border rounded-xl border border-border bg-card text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3 px-3 py-2.5">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium text-navy-900">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-2">
          <Button asChild className="w-full">
            <a href={doc.sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden />
              فتح صفحة المصدر الأصلي
            </a>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" disabled title="يُتاح عند ربط الملف الموثّق">
              {doc.access === 'download' ? <Download aria-hidden /> : <Eye aria-hidden />}
              {doc.access === 'download' ? 'تنزيل' : 'معاينة'}
            </Button>
            <Button variant="outline" onClick={copyLink}>
              <Copy aria-hidden />
              نسخ الرابط
            </Button>
          </div>
          <p className="text-xs leading-6 text-muted-foreground">
            هذا مثال توضيحي، لذلك يشير الرابط إلى الصفحة الرئيسية للمصدر. التنزيل
            والمعاينة داخل الموقع يُتاحان للملفات الموثقة التي تسمح شروط مصدرها
            بذلك.
          </p>
        </div>

        <Button asChild variant="gold" className="w-full">
          <Link to="/assistant" search={{ grade: doc.gradeIds[0] }}>
            <Sparkles aria-hidden />
            اسأل Nasser AI عن هذا الموضوع
          </Link>
        </Button>
      </div>
    </>
  )
}
