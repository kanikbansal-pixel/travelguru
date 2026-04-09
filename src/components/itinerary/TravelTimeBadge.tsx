import { Clock } from 'lucide-react'

interface Props {
  minutes: number
}

export function TravelTimeBadge({ minutes }: Props) {
  return (
    <div className="flex items-center gap-1.5 py-1 px-2 my-1 ml-4 w-fit text-xs text-stone-400 bg-stone-50 border border-stone-100 rounded-md">
      <Clock size={11} />
      <span>{minutes} min travel</span>
    </div>
  )
}
