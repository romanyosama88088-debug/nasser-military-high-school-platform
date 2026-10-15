import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Shown wherever preview fixtures are rendered, so no sample reads as official. */
export function SampleNotice({ className }: { className?: string }) {
  return (
    <p
      role="note"
      className={cn(
        'flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft px-3 py-2 text-sm text-[#6b3f00]',
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        <strong className="font-semibold">نسخة معاينة:</strong> الملفات والإعلانات
        والمواعيد المعروضة أمثلة توضيحية لطريقة العرض، وليست معلومات رسمية
        معتمدة. يحل محلها المحتوى الموثق عند تفعيل المزامنة.
      </span>
    </p>
  )
}
