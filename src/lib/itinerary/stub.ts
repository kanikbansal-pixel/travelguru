import type { Itinerary, TripInputs } from '@/types'

// Returns a hardcoded 3-day Tokyo itinerary for Phase 1 skeleton.
// Replaced by the real OpenAI call in Phase 2.
export function getStubItinerary(inputs: TripInputs): Itinerary {
  const baseDate = new Date(inputs.startDate)

  const fmt = (offset: number): string => {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + offset)
    return d.toISOString().split('T')[0]
  }

  return {
    destination: inputs.destination || 'Tokyo',
    days: [
      {
        dayIndex: 0,
        date: fmt(0),
        theme: 'East Side: Asakusa and Ueno',
        places: [
          {
            name: 'Senso-ji Temple',
            category: 'Cultural site',
            description: "Tokyo's oldest temple, with a dramatic gate and incense-filled courtyard.",
            lat: 35.7148,
            lng: 139.7967,
            startTime: '09:00',
            durationMinutes: 75,
            travelTimeToNextMinutes: 15,
            rationale: `Senso-ji is the anchor for any first morning in Tokyo — it combines genuine historical atmosphere with a vibrant market street that suits your interest in ${inputs.interests[0] ?? 'culture'}. Arriving early means you can experience the temple itself before the crowds arrive.`,
            sourceLabel: 'Consistently recommended in budget travel communities and long-stay Tokyo guides',
          },
          {
            name: 'Nakamise-dori Shopping Street',
            category: 'Market',
            description: 'Traditional shopping lane leading to Senso-ji, lined with souvenirs and street snacks.',
            lat: 35.7133,
            lng: 139.7966,
            startTime: '10:15',
            durationMinutes: 45,
            travelTimeToNextMinutes: 20,
            rationale: 'A natural continuation from the temple, Nakamise-dori is the best place to pick up early souvenirs and try ningyo-yaki (small cakes) without tourist-trap pricing. It matches your relaxed pace — no ticket or queues required.',
            sourceLabel: 'Frequently highlighted in solo traveler trip reports for Tokyo',
          },
          {
            name: 'Ueno Park and Tokyo National Museum',
            category: 'Museum / Park',
            description: 'Japans largest public art and history museum, set inside a sprawling park.',
            lat: 35.7189,
            lng: 139.7745,
            startTime: '11:30',
            durationMinutes: 120,
            travelTimeToNextMinutes: 25,
            rationale: 'The Tokyo National Museum holds the worlds largest collection of Japanese art — a strong match for travelers interested in cultural depth over surface-level tourism. The park setting allows you to decompress between galleries, which keeps the pace realistic.',
            sourceLabel: 'Recommended by long-term Japan residents in travel discussion forums',
          },
          {
            name: 'Yanaka Ginza Shopping Street',
            category: 'Neighbourhood',
            description: 'One of Tokyos last old-town shotengai (shopping streets), with local food stalls and artisan shops.',
            lat: 35.7218,
            lng: 139.7703,
            startTime: '14:30',
            durationMinutes: 60,
            travelTimeToNextMinutes: null,
            rationale: 'Yanaka feels like the Tokyo that survived modernisation — it is the kind of hidden neighbourhood that research-heavy travelers seek out specifically. This is the afternoon where your itinerary diverges from the generic tourist route.',
            sourceLabel: 'Consistently cited in independent travel blogs as the best "old Tokyo" walk',
          },
        ],
      },
      {
        dayIndex: 1,
        date: fmt(1),
        theme: 'West Side: Shinjuku and Harajuku',
        places: [
          {
            name: 'Meiji Jingu Shrine',
            category: 'Shrine',
            description: 'Forest shrine dedicated to Emperor Meiji, with a long wooded approach path.',
            lat: 35.6764,
            lng: 139.6993,
            startTime: '09:00',
            durationMinutes: 60,
            travelTimeToNextMinutes: 10,
            rationale: 'Meiji Jingu offers a genuinely calm counterpoint to the sensory overload of Shinjuku. Visiting in the morning means the forested approach path is quiet — this is the kind of experience that justifies the trip for travelers who want more than crowds.',
            sourceLabel: 'Highly rated in experienced traveler reviews for first-time Japan visits',
          },
          {
            name: 'Takeshita Street, Harajuku',
            category: 'Street / Culture',
            description: 'Narrow pedestrian street famous for youth fashion, crepes, and street culture.',
            lat: 35.6702,
            lng: 139.7028,
            startTime: '10:15',
            durationMinutes: 45,
            travelTimeToNextMinutes: 20,
            rationale: 'Takeshita Street is worth 45 minutes even if fashion is not your main interest — it shows a side of Tokyo youth culture that has no equivalent anywhere else. The crepe stalls alone justify the detour.',
            sourceLabel: 'Regularly discussed in Japan travel subreddits as a must-see cultural contrast',
          },
          {
            name: 'Shinjuku Gyoen National Garden',
            category: 'Garden',
            description: 'Large formal garden with Japanese, French, and English sections — a rare quiet space near Shinjuku.',
            lat: 35.6852,
            lng: 139.7100,
            startTime: '11:30',
            durationMinutes: 90,
            travelTimeToNextMinutes: 15,
            rationale: 'Shinjuku Gyoen is where Tokyo locals go to recover from the city. At a relaxed pace, 90 minutes here is genuinely restorative — it justifies itself by preventing the afternoon fatigue that hits most visitors around day two.',
            sourceLabel: 'Recommended in multiple long-form Tokyo guides for mid-trip recovery',
          },
          {
            name: 'Omoide Yokocho (Memory Lane)',
            category: 'Food / Nightlife',
            description: 'Narrow alley of tiny yakitori bars dating from the post-war period, west of Shinjuku station.',
            lat: 35.6937,
            lng: 139.7005,
            startTime: '18:00',
            durationMinutes: 90,
            travelTimeToNextMinutes: null,
            rationale: 'Omoide Yokocho is one of the few places in Tokyo where the atmosphere genuinely cannot be replicated — the smoke, the tiny counter seats, the decades-old signage. This is the kind of evening that becomes the story travelers tell when they get home.',
            sourceLabel: 'Universally cited in traveler trip reports as the best single evening in Tokyo',
          },
        ],
      },
      {
        dayIndex: 2,
        date: fmt(2),
        theme: 'East Modern: Akihabara and Shibuya',
        places: [
          {
            name: 'Akihabara Electric Town',
            category: 'Neighbourhood',
            description: 'Tokyos electronics and pop culture district, with multi-floor game centres and manga shops.',
            lat: 35.7023,
            lng: 139.7745,
            startTime: '10:00',
            durationMinutes: 90,
            travelTimeToNextMinutes: 30,
            rationale: 'Even for travelers who are not anime fans, Akihabara is a fascinating study in commercial scale — the density and verticality of the shops is unlike anything outside Japan. One focused morning here is enough to understand it without overload.',
            sourceLabel: 'Recommended in Tokyo travel discussions for a distinct cultural contrast from traditional sites',
          },
          {
            name: 'teamLab Borderless (Azabudai)',
            category: 'Art / Experience',
            description: 'Immersive digital art museum with walk-through light installations across multiple floors.',
            lat: 35.6571,
            lng: 139.7392,
            startTime: '13:00',
            durationMinutes: 120,
            travelTimeToNextMinutes: 25,
            rationale: 'teamLab is genuinely world-class as a visual experience and has no real equivalent — it is the kind of visit that photographs cannot do justice. Booking in advance is required; this slot assumes a pre-booked afternoon entry.',
            sourceLabel: 'Described in travel blogs as the single most visually distinctive experience in contemporary Tokyo',
          },
          {
            name: 'Shibuya Crossing and Scramble Square',
            category: 'Landmark / Viewpoint',
            description: 'The worlds busiest pedestrian crossing, best observed from the Scramble Square rooftop observation deck.',
            lat: 35.6595,
            lng: 139.7004,
            startTime: '16:30',
            durationMinutes: 60,
            travelTimeToNextMinutes: null,
            rationale: 'Shibuya Crossing at dusk is one of those urban moments that holds up even with high expectations — watching it from the Scramble Square deck gives the visual payoff without the ground-level crowd stress. A perfect final afternoon before dinner.',
            sourceLabel: 'Frequently recommended in Japan first-timer guides as the most iconic single image of modern Tokyo',
          },
        ],
      },
    ],
  }
}
