import { Link } from '@tanstack/react-router'
import { Wordmark } from '@/components/brand/crest'
import { sources } from '@/data/fixtures'

export function SiteFooter() {
  const official = sources.filter((s) => s.baseUrl)
  return (
    <footer className="mt-16 bg-navy-950 text-white/75">
      <div className="gold-rule opacity-60" />
      <div className="mx-auto grid max-w-content gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Wordmark />
          <p className="max-w-sm text-sm leading-7">
            منصة رقمية تخدم طلاب مدرسة ناصر الثانوية العسكرية بأسيوط وطلاب
            المنازل. نذكر مصدر كل ملف وتاريخ آخر تحقق منه. هذا الموقع لا يمثل
            الموقع الرسمي لوزارة التربية والتعليم.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gold-300">المنصة</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/grades" className="hover:text-white">الصفوف الدراسية</Link></li>
            <li><Link to="/library" search={{}} className="hover:text-white">المكتبة التعليمية</Link></li>
            <li><Link to="/assistant" className="hover:text-white">Nasser AI — المساعد التعليمي</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gold-300">مصادر نتابعها</h2>
          <ul className="space-y-2 text-sm">
            {official.map((s) => (
              <li key={s.id}>
                <a href={s.baseUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-content px-4 py-4 text-xs text-white/50 sm:px-6" dir="ltr">
          Nasser Military High School — Assiut, Egypt
        </p>
      </div>
    </footer>
  )
}
