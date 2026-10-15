import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Crest } from '@/components/brand/crest'

export function NotFoundPage() {
  return (
    <main className="grid min-h-svh place-items-center px-6 py-16">
      <div className="max-w-md space-y-6 text-center">
        <Crest className="mx-auto h-20 w-18" title="" />
        <p className="numerals font-brand text-2xl text-gold-600">404</p>
        <h1 className="text-3xl font-bold text-navy-900">
          الصفحة غير موجودة
        </h1>
        <p className="text-muted-foreground">
          لم نجد هذه الصفحة. ربما تغيّر الرابط أو نُقل المحتوى إلى الأرشيف. تحقق من العنوان أو ابدأ من الصفحة الرئيسية.
        </p>
        <Button asChild>
          <Link to="/">العودة إلى الرئيسية</Link>
        </Button>
      </div>
    </main>
  )
}

export function RouteErrorPage({ reset }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <main className="grid min-h-svh place-items-center px-6 py-16">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold text-navy-900">
          تعذّر تحميل الصفحة
        </h1>
        <p role="alert" className="text-muted-foreground">
          حدث خطأ مؤقت. حاول مرة أخرى، أو عد إلى الصفحة الرئيسية. بقية المنصة تعمل كالمعتاد.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => {
              void router.invalidate()
              reset()
            }}
          >
            حاول مرة أخرى
          </Button>
          <Button variant="outline" asChild>
            <a href="/">العودة إلى الرئيسية</a>
          </Button>
        </div>
      </div>
    </main>
  )
}
