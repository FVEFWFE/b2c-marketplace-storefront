"use client"
import React from 'react'

interface Result {
  competitor: string
  confidence: number
  url: string | null
  latest_price: number | null
  currency: string | null
}

function formatMoney(cents?: number | null, currency?: string | null) {
  if (!cents || !currency) return '—'
  const num = cents / 100
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(num)
}

export default function PriceTracker({ productId, ourPriceCents }: { productId: string; ourPriceCents?: number }) {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [results, setResults] = React.useState<Result[]>([])

  React.useEffect(() => {
    const key = `pt_${productId}`
    const cached = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
    if (cached) {
      const payload = JSON.parse(cached)
      if (Date.now() - payload.ts < 15 * 60 * 1000) {
        setResults(payload.results)
        setLoading(false)
        return
      }
    }
    setLoading(true)
    fetch(`/store/price-tracker/${productId}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results || [])
        if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify({ ts: Date.now(), results: data.results || [] }))
      })
      .catch((e) => setError(e?.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [productId])

  if (loading) return <div>Searching for best price...</div>
  if (error) return <div>Price comparison unavailable</div>
  if (!results.length) return <div>Price comparison unavailable</div>

  return (
    <div className="space-y-2">
      {results.map((r) => {
        const savings = ourPriceCents && r.latest_price ? ourPriceCents - r.latest_price : undefined
        return (
          <div key={r.competitor} className="flex items-center justify-between border rounded p-2">
            <div>
              <div className="font-medium capitalize">{r.competitor}</div>
              <div className="text-sm text-gray-600">Confidence: {r.confidence}%</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{formatMoney(r.latest_price, r.currency)}</div>
              {typeof savings === 'number' && savings > 0 && (
                <div className="text-green-600 text-sm">You save {formatMoney(savings, r.currency || 'USD')}</div>
              )}
              {r.url && (
                <a className="text-blue-600 text-sm" href={r.url} target="_blank" rel="noreferrer">View</a>
              )}
            </div>
          </div>
        )
      })}
      <div className="text-xs text-gray-500">Wrong product? Ask admin to set a manual override.</div>
    </div>
  )
}