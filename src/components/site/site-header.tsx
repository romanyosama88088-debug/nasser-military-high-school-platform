import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Library, Menu, Search, Sparkles, GraduationCap, House } from 'lucide-react'

import { Wordmark } from '@/components/brand/crest'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const NAV = [
  { to: '/', label: 'الرئيسية', icon: House },
  { to: '/grades', label: 'الصفوف الدراسية', icon: GraduationCap },
  { to: '/library', label: 'المكتبة التعليمية', icon: Library },
  { to: '/assistant', label: 'Nasser AI', icon: Sparkles },
] as const

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-gold-500/25 bg-navy-950/95 backdrop-blur supports-[backdrop-filter]:bg-navy-950/85">
      <div className="mx-auto flex h-16 max-w-content items-center gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="الصفحة الرئيسية" className="rounded-md">
          <Wordmark />
        </Link>

        <nav aria-label="القائمة الرئيسية" className="ms-auto hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === '/' }}
              className="rounded-md px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white data-[status=active]:text-gold-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 lg:ms-2">
          <Button asChild variant="onDark" size="sm" className="hidden sm:inline-flex">
            <Link to="/library" search={{}}>
              <Search aria-hidden />
              بحث
            </Link>
          </Button>
          <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex">
            <Link to="/assistant">
              <Sparkles aria-hidden />
              اسأل Nasser AI
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="onDark" size="icon" className="lg:hidden" aria-label="فتح القائمة">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-navy-950 text-white border-gold-500/30">
              <SheetHeader>
                <SheetTitle className="text-gold-300">القائمة</SheetTitle>
                <SheetDescription className="text-white/60">
                  الصفوف والمكتبة والمساعد التعليمي
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="قائمة الهاتف" className="flex flex-col gap-1 px-4">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.to === '/' }}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-base text-white/85 hover:bg-white/5 data-[status=active]:bg-white/5 data-[status=active]:text-gold-300"
                  >
                    <item.icon className="size-5 text-gold-500" aria-hidden />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
