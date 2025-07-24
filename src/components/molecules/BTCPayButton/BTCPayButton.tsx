"use client"

import { useState } from "react"
import { DollarIcon } from "@/icons"
import { Button, Badge } from "@/components/atoms"

interface BTCPayButtonProps {
  amount: number
  orderId: string
  className?: string
  onSuccess?: (invoiceId: string) => void
}

export function BTCPayButton({
  amount,
  orderId,
  className = "",
  onSuccess,
}: BTCPayButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleBTCPayment = async () => {
    setLoading(true)
    setError(null)

    try {
      // In production, this would call your backend API to create a BTCPay invoice
      const response = await fetch("/api/btcpay/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          orderId,
          currency: "USD",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create Bitcoin invoice")
      }

      const { checkoutLink, invoiceId } = await response.json()

      // Open BTCPay checkout in new window
      window.open(checkoutLink, "_blank")

      if (onSuccess) {
        onSuccess(invoiceId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Button
        onClick={handleBTCPayment}
        disabled={loading}
        className="w-full bg-warning hover:bg-warning-hover text-warning-on-primary flex items-center justify-center gap-2"
      >
        <DollarIcon size={20} />
        <span>{loading ? "Creating Invoice..." : "Pay with Bitcoin"}</span>
      </Button>

      <div className="flex items-center justify-between text-xs">
        <Badge className="bg-positive/10 text-positive border-positive">
          5% Crypto Discount Applied
        </Badge>
        <span className="text-tertiary">Powered by BTCPay Server</span>
      </div>

      {error && (
        <p className="text-negative text-sm">{error}</p>
      )}

      <div className="text-xs text-tertiary space-y-1">
        <p>✓ Instant payment verification</p>
        <p>✓ No personal information required</p>
        <p>✓ Lower fees = bigger savings for you</p>
      </div>
    </div>
  )
}