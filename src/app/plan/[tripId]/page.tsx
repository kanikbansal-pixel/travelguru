import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ItineraryView } from '@/components/itinerary/ItineraryView'
import type { Trip } from '@/types'

interface Props {
  params: Promise<{ tripId: string }>
}

export async function generateMetadata() {
  return { title: 'Your itinerary — WayPoint' }
}

export default async function TripPage({ params }: Props) {
  const { tripId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single()

  if (error || !data) notFound()

  const trip = data as Trip

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          href="/plan"
          className="inline-flex items-center text-sm text-stone-400 hover:text-stone-700 mb-6 transition-colors"
        >
          ← Plan a new trip
        </Link>

        <ItineraryView itinerary={trip.itinerary} tripId={trip.id} />
      </div>
    </main>
  )
}
