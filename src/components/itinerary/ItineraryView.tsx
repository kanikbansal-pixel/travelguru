'use client'

import { useState } from 'react'
import { DayCard } from '@/components/itinerary/DayCard'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import type { Itinerary } from '@/types'

interface Props {
  itinerary: Itinerary
  tripId: string
}

function buildPlainTextExport(itinerary: Itinerary): string {
  const lines: string[] = [`WayPoint Itinerary — ${itinerary.destination}`, '']
  for (const day of itinerary.days) {
    lines.push(`Day ${day.dayIndex + 1}: ${day.theme} (${day.date})`)
    for (const place of day.places) {
      lines.push(`  ${place.startTime} — ${place.name} (${place.category})`)
      lines.push(`    ${place.rationale}`)
      lines.push(`    Source: ${place.sourceLabel}`)
      if (place.travelTimeToNextMinutes !== null) {
        lines.push(`    → ${place.travelTimeToNextMinutes} min travel to next stop`)
      }
    }
    lines.push('')
  }
  return lines.join('\n')
}

export function ItineraryView({ itinerary }: Omit<Props, 'tripId'> & { tripId?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildPlainTextExport(itinerary))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{itinerary.destination}</h1>
          <p className="text-sm text-stone-400 mt-0.5">{itinerary.days.length}-day itinerary</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <>
              <Check size={14} className="mr-1.5" /> Copied
            </>
          ) : (
            <>
              <Copy size={14} className="mr-1.5" /> Copy itinerary
            </>
          )}
        </Button>
      </div>

      {/* Days */}
      <div className="space-y-10">
        {itinerary.days.map(day => (
          <DayCard key={day.dayIndex} day={day} />
        ))}
      </div>
    </div>
  )
}
