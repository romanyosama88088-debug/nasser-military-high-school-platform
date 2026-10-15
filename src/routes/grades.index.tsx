import { createFileRoute } from '@tanstack/react-router'

import { GradeCard } from '@/components/site/grade-card'
import { grades, systems } from '@/data/fixtures'

export const Route = createFileRoute('/grades/')({
  head: () => ({
    meta: [
      { title: 'الصفوف الدراسية — Nasser Military High School' },
      { name: 'description', content: 'مساحة مستقلة لكل صف في نظامي البكالوريا المصرية والثانوية العامة.' },
    ],
  }),
  component: GradesPage,
})

function GradesPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pattern-girih absolute inset-0 opacity-[0.06]" aria-hidden />
        <div className="relative mx-auto max-w-content px-4 py-12 sm:px-6">
          <p className="mb-2 text-sm text-gold-300">الصفوف الدراسية</p>
          <h1 className="text-3xl font-bold sm:text-4xl">اختر صفك</h1>
          <p className="mt-3 max-w-2xl leading-8 text-white/75">
            لكل صف مساحة مستقلة تضم مواده وكتبه وتقييماته ونماذجه وإعلاناته
            ومواعيده، مرتبطة بالسنة الدراسية الصحيحة.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-content space-y-12 px-4 py-10 sm:px-6">
        {systems.map((system) => {
          const list = grades
            .filter((g) => g.systemId === system.id && g.active)
            .sort((a, b) => a.id.localeCompare(b.id))
          return (
            <section key={system.id} aria-labelledby={`sys-${system.id}`}>
              <div className="mb-5">
                <h2 id={`sys-${system.id}`} className="text-2xl font-bold text-navy-900">
                  {system.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{system.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((g) => (
                  <GradeCard key={g.id} grade={g} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
