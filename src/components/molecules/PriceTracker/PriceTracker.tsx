"use client"

import { useState, useEffect } from "react"
import { clsx } from "clsx"

interface PricePoint {
  date: string
  price: number
  retailer: string
}

interface PriceTrackerProps {
  productId: string
  currentPrice: number
  msrp?: number
  className?: string
}

export const PriceTracker = ({ 
  productId, 
  currentPrice, 
  msrp,
  className 
}: PriceTrackerProps) => {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [averagePrice, setAveragePrice] = useState(0)
  const [savings, setSavings] = useState(0)

  useEffect(() => {
    // Mock price history data - in production this would come from an API
    const mockData: PricePoint[] = [
      { date: "2024-01-01", price: currentPrice * 1.15, retailer: "Amazon" },
      { date: "2024-01-15", price: currentPrice * 1.18, retailer: "Best Buy" },
      { date: "2024-02-01", price: currentPrice * 1.12, retailer: "Newegg" },
      { date: "2024-02-15", price: currentPrice * 1.20, retailer: "B&H" },
      { date: "2024-03-01", price: currentPrice * 1.14, retailer: "Amazon" },
      { date: "2024-03-15", price: currentPrice * 1.16, retailer: "Best Buy" },
    ]
    
    setTimeout(() => {
      setPriceHistory(mockData)
      const avg = mockData.reduce((sum, point) => sum + point.price, 0) / mockData.length
      setAveragePrice(avg)
      setSavings(((avg - currentPrice) / avg) * 100)
      setIsLoading(false)
    }, 1000)
  }, [currentPrice])

  if (isLoading) {
    return (
      <div className={clsx("bg-component-secondary rounded-lg p-4", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-secondary rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(
      "bg-component-secondary rounded-lg p-4 border border-premium-secondary",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-premium text-lg">📊</span>
        <h4 className="font-semibold text-premium">90-Day Price Analysis</h4>
        <span className="px-2 py-0.5 bg-premium-secondary text-premium text-xs rounded-full font-medium">
          AI-Powered
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-secondary uppercase tracking-wide">Market Average</p>
          <p className="text-lg font-semibold text-primary">
            ${averagePrice.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-secondary uppercase tracking-wide">Your Savings</p>
          <p className="text-lg font-semibold text-positive">
            {savings.toFixed(1)}% OFF
          </p>
        </div>
      </div>

      {msrp && (
        <div className="bg-positive-secondary border border-positive-secondary rounded-md p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-positive font-medium">vs. MSRP</span>
            <span className="text-lg font-bold text-positive">
              ${(msrp - currentPrice).toFixed(2)} saved
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs text-secondary uppercase tracking-wide">Recent Retailer Prices</p>
        {priceHistory.slice(-3).map((point, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-secondary">{point.retailer}</span>
            <span className="font-medium text-primary">${point.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-primary text-xs text-secondary">
        <div className="flex items-center gap-2">
          <span>🔒</span>
          <span>Price verified by ArbVault AI • Updated daily</span>
        </div>
      </div>
    </div>
  )
}

export default PriceTracker