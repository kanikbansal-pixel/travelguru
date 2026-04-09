import { PlaceCard } from '@/components/itinerary/PlaceCard'
import { TravelTimeBadge } from '@/components/itinerary/TravelTimeBadge'
import type { Day } from '@/types'

interface Props {
  day: Day
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function DayCard({ day }: Props) {
  return (
    <section className="space-y-3">
      {/* Day header */}
      <div className="border-b border-stone-200 pb-2">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">
          Day {day.dayIndex + 1} · {formatDate(day.date)}
        </p>
        <h2 className="text-lg font-semibold text-stone-900 mt-0.5">{day.theme}</h2>
      </div>

      {/* Places with travel times between them */}
      <div className="space-y-1">
        {day.places.map((place, i) => (
          <div key={`${day.dayIndex}-${i}`}>
            <PlaceCard place={place} index={i} />
            {place.travelTimeToNextMinutes !== null && (
              <TravelTimeBadge minutes={place.travelTimeToNextMinutes} />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
