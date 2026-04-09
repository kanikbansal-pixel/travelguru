import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getStubItinerary } from '@/lib/itinerary/stub'
import { createClient } from '@/lib/supabase/server'
import type { TripInputs } from '@/types'

const RequestSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid start date'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid end date'),
  budgetLevel: z.enum(['budget', 'mid', 'luxury']),
  pace: z.enum(['relaxed', 'moderate', 'packed']),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  mustDo: z.string(),
  mustAvoid: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const inputs: TripInputs = parsed.data

    // Phase 1: stub — replaced by real OpenAI call in Phase 2
    const itinerary = getStubItinerary(inputs)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('trips')
      .insert({
        user_id: user?.id ?? null,
        destination: inputs.destination,
        start_date: inputs.startDate,
        end_date: inputs.endDate,
        inputs,
        itinerary,
        status: 'draft',
      })
      .select('id')
      .single()

    if (error) {
      console.error('[generate] Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save itinerary. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tripId: data.id, itinerary })
  } catch (err) {
    console.error('[generate] unexpected error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
