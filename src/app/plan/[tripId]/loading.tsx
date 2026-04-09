export default function Loading() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-stone-500">Building your itinerary…</p>
      </div>
    </main>
  )
}
