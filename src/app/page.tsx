import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'WayPoint — Realistic travel itineraries from real traveler research',
  description:
    'Plan a 3–7 day international city trip faster than doing Reddit, ChatGPT, and spreadsheet research manually.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-stone-100 bg-white">
        <span className="font-bold text-stone-900 text-lg tracking-tight">WayPoint</span>
        <Link href="/plan">
          <Button size="sm">Plan a trip</Button>
        </Link>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-xl text-center space-y-6 py-20">
          <div className="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-full">
            MVP · Phase 1 skeleton
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 leading-tight tracking-tight">
            Itineraries built from real traveler research
          </h1>

          <p className="text-lg text-stone-500 leading-relaxed">
            Not just AI-generated lists. Every recommendation includes a specific reason and a source — so you know why it&apos;s there, not just what it is.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/plan">
              <Button size="lg" className="w-full sm:w-auto">
                Plan my trip →
              </Button>
            </Link>
          </div>

          {/* Social proof hints */}
          <div className="pt-4 grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Per day, max', value: '5 places' },
              { label: 'Travel time shown', value: 'Always' },
              { label: 'Rationale per stop', value: 'Every one' },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-0.5">
                <p className="font-semibold text-stone-900">{value}</p>
                <p className="text-xs text-stone-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="px-6 py-4 text-center text-xs text-stone-400 border-t border-stone-100">
        WayPoint MVP · Not yet ready for public use
      </footer>
    </main>
  )
}
