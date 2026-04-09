import { TripForm } from '@/components/trip-form/TripForm'

export const metadata = {
  title: 'Plan your trip — WayPoint',
  description: 'Tell us where you\'re going and we\'ll build a realistic, source-backed itinerary.',
}

export default function PlanPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900">Plan your trip</h1>
          <p className="mt-2 text-stone-500">
            Tell us where you&apos;re going and we&apos;ll build a realistic, day-by-day itinerary with reasons for every recommendation.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
          <TripForm />
        </div>
      </div>
    </main>
  )
}
