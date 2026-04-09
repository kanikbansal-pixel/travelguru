export interface TripInputs {
  destination: string
  startDate: string
  endDate: string
  budgetLevel: 'budget' | 'mid' | 'luxury'
  pace: 'relaxed' | 'moderate' | 'packed'
  interests: string[]
  mustDo: string
  mustAvoid: string
}

export interface Place {
  name: string
  category: string
  description: string
  lat: number
  lng: number
  startTime: string
  durationMinutes: number
  travelTimeToNextMinutes: number | null
  rationale: string
  sourceLabel: string
}

export interface Day {
  dayIndex: number
  date: string
  theme: string
  places: Place[]
}

export interface Itinerary {
  destination: string
  days: Day[]
}

export interface Trip {
  id: string
  user_id: string | null
  destination: string
  start_date: string
  end_date: string
  inputs: TripInputs
  itinerary: Itinerary
  status: 'draft' | 'saved'
  created_at: string
}
