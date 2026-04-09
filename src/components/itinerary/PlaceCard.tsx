import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Place } from '@/types'

interface Props {
  place: Place
  index: number
}

export function PlaceCard({ place, index }: Props) {
  return (
    <Card className="border border-stone-200 shadow-none">
      <CardContent className="pt-4 pb-3 space-y-2">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-semibold flex items-center justify-center">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-stone-900 leading-tight">{place.name}</p>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <Badge variant="secondary" className="text-xs">
                {place.category}
              </Badge>
              <span className="text-xs text-stone-400">
                {place.startTime} · ~{place.durationMinutes} min
              </span>
            </div>
          </div>
        </div>

        {/* Trust layer — always visible, never hidden */}
        <div className="ml-9 space-y-1.5">
          <p className="text-sm text-stone-700 leading-relaxed">{place.rationale}</p>
          <p className="text-xs text-stone-400 italic">{place.sourceLabel}</p>
        </div>
      </CardContent>
    </Card>
  )
}
