"use client"

import { useState, useEffect } from "react"
import { ArrowUpIcon, ArrowDownIcon, TimeIcon } from "@/icons"
import { Badge } from "@/components/atoms"

interface PricePoint {
  date: string
  price: number
  retailPrice?: number
}

interface PriceHistoryTrackerProps {
  currentPrice: number
  productId: string
  productName: string
  className?: string
}

export function PriceHistoryTracker({
  currentPrice,
  productId,
  productName,
  className = "",
}: PriceHistoryTrackerProps) {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Simulate fetching price history
    // In production, this would be an API call
    const generatePriceHistory = () => {
      const history: PricePoint[] = []
      const days = 90
      const basePrice = currentPrice * 1.2 // Assume retail is 20% higher
      
      for (let i = days; i >= 0; i -= 7) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        
        // Generate realistic price fluctuations
        const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
        const price = currentPrice * (1 + variation)
        const retailPrice = basePrice * (1 + variation * 0.5)
        
        history.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(price * 100) / 100,
          retailPrice: Math.round(retailPrice * 100) / 100,
        })
      }
      
      setPriceHistory(history)
      setLoading(false)
    }

    generatePriceHistory()
  }, [currentPrice, productId])

  if (loading) {
    return <div className="animate-pulse bg-component h-20 rounded-md" />
  }

  const lowestPrice = Math.min(...priceHistory.map(p => p.price))
  const highestRetail = Math.max(...priceHistory.map(p => p.retailPrice || 0))
  const savings = highestRetail - currentPrice
  const savingsPercent = Math.round((savings / highestRetail) * 100)

  const priceChange = currentPrice - priceHistory[0].price
  const isPriceUp = priceChange > 0

  return (
    <div className={`bg-component-secondary rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TimeIcon size={20} />
          <h3 className="font-semibold text-sm">90-Day Price History</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-action hover:text-action-hover"
        >
          {showDetails ? "Hide" : "Show"} Details
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-tertiary mb-1">Current vs Retail</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-positive">
              ${savings.toFixed(2)} OFF
            </span>
            <Badge className="bg-positive text-positive-on-primary text-xs">
              {savingsPercent}% Savings
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-xs text-tertiary mb-1">Price Trend</p>
          <div className="flex items-center gap-2">
            {isPriceUp ? (
              <ArrowUpIcon size={16} className="text-negative" />
            ) : (
              <ArrowDownIcon size={16} className="text-positive" />
            )}
            <span className={`text-sm font-medium ${isPriceUp ? "text-negative" : "text-positive"}`}>
              ${Math.abs(priceChange).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-secondary">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-tertiary">Lowest in 90 days:</span>
              <span className="font-medium">${lowestPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-tertiary">Avg. Retail Price:</span>
              <span className="font-medium line-through text-tertiary">
                ${highestRetail.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-tertiary">Your Price:</span>
              <span className="font-medium text-positive">${currentPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-positive/10 rounded text-xs text-positive">
            <p className="font-medium">🎯 Great Deal Alert!</p>
            <p>This price is {savingsPercent}% below retail average</p>
          </div>
        </div>
      )}
    </div>
  )
}