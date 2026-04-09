'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TripInputs } from '@/types'

const INTERESTS = [
  'Food & drink',
  'Culture & history',
  'Art & design',
  'Nature & outdoors',
  'Nightlife',
  'Shopping',
  'Architecture',
  'Hidden gems',
]

export function TripForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [form, setForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budgetLevel: '' as TripInputs['budgetLevel'] | '',
    pace: '' as TripInputs['pace'] | '',
    mustDo: '',
    mustAvoid: '',
  })

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const validate = (): string | null => {
    if (!form.destination.trim()) return 'Please enter a destination.'
    if (!form.startDate) return 'Please select a start date.'
    if (!form.endDate) return 'Please select an end date.'
    if (form.endDate < form.startDate) return 'End date must be after start date.'
    const days = (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000 + 1
    if (days > 7) return 'WayPoint supports trips up to 7 days for the MVP.'
    if (!form.budgetLevel) return 'Please select a budget level.'
    if (!form.pace) return 'Please select a travel pace.'
    if (selectedInterests.length === 0) return 'Please select at least one interest.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const payload: TripInputs = {
        destination: form.destination.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        budgetLevel: form.budgetLevel as TripInputs['budgetLevel'],
        pace: form.pace as TripInputs['pace'],
        interests: selectedInterests,
        mustDo: form.mustDo,
        mustAvoid: form.mustAvoid,
      }

      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json: unknown = await res.json()

      if (!res.ok) {
        const errBody = json as { error?: string }
        setError(errBody.error ?? 'Something went wrong. Please try again.')
        return
      }

      const successBody = json as { tripId: string }
      router.push(`/plan/${successBody.tripId}`)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Destination */}
      <div className="space-y-1.5">
        <Label htmlFor="destination">Destination city</Label>
        <Input
          id="destination"
          placeholder="e.g. Tokyo, Japan"
          value={form.destination}
          onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
          disabled={loading}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Start date</Label>
          <Input
            id="startDate"
            type="date"
            value={form.startDate}
            onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            disabled={loading}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate">End date</Label>
          <Input
            id="endDate"
            type="date"
            value={form.endDate}
            onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
            disabled={loading}
          />
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-1.5">
        <Label>Budget</Label>
        <Select
          value={form.budgetLevel}
          onValueChange={v => setForm(f => ({ ...f, budgetLevel: v as TripInputs['budgetLevel'] }))}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select budget level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="budget">Budget — hostels, street food, free sights</SelectItem>
            <SelectItem value="mid">Mid-range — 3-star hotels, sit-down meals</SelectItem>
            <SelectItem value="luxury">Luxury — premium hotels, fine dining</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pace */}
      <div className="space-y-1.5">
        <Label>Travel pace</Label>
        <Select
          value={form.pace}
          onValueChange={v => setForm(f => ({ ...f, pace: v as TripInputs['pace'] }))}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select travel pace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relaxed">Relaxed — 3–4 places per day, lots of downtime</SelectItem>
            <SelectItem value="moderate">Moderate — 4–5 places per day, balanced</SelectItem>
            <SelectItem value="packed">Packed — 5 places per day, maximum coverage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interests */}
      <div className="space-y-2">
        <Label>Interests <span className="text-stone-400 font-normal">(pick all that apply)</span></Label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                selectedInterests.includes(interest)
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Must-do */}
      <div className="space-y-1.5">
        <Label htmlFor="mustDo">
          Must-do <span className="text-stone-400 font-normal">(optional)</span>
        </Label>
        <Textarea
          id="mustDo"
          placeholder="e.g. Visit teamLab, eat ramen in a local spot"
          rows={2}
          value={form.mustDo}
          onChange={e => setForm(f => ({ ...f, mustDo: e.target.value }))}
          disabled={loading}
        />
      </div>

      {/* Must-avoid */}
      <div className="space-y-1.5">
        <Label htmlFor="mustAvoid">
          Must-avoid <span className="text-stone-400 font-normal">(optional)</span>
        </Label>
        <Textarea
          id="mustAvoid"
          placeholder="e.g. Crowded tourist traps, Disneyland"
          rows={2}
          value={form.mustAvoid}
          onChange={e => setForm(f => ({ ...f, mustAvoid: e.target.value }))}
          disabled={loading}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? 'Building your itinerary…' : 'Plan my trip →'}
      </Button>
    </form>
  )
}
