import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NotFoundPage } from '@/components/error-pages'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'

import '../styles.css'

const siteName = 'Nasser Military High School'
const siteDescription =
  'منصة تعليمية رقمية لمدرسة ناصر الثانوية العسكرية بأسيوط: الكتب والتقييمات والنماذج والإعلانات والمواعيد في مكان واحد، مع ذكر مصدر كل ملف وتاريخ آخر تحديث.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: `${siteName} — مدرسة ناصر الثانوية العسكرية بأسيوط`,
      },
      { name: 'theme-color', content: '#08152E' },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      { property: 'og:image', content: '/og-image.svg' },
      { property: 'og:locale', content: 'ar_EG' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@500;600;700;800&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>
          <a href="#main" className="skip-link">
            تخطَّ إلى المحتوى
          </a>
          <SiteHeader />
          <div id="main">{children}</div>
          <SiteFooter />
        </TooltipProvider>
        <Toaster position="top-center" dir="rtl" />
        <Scripts />
      </body>
    </html>
  )
}
