"use client"

import { useState } from "react"
import { clsx } from "clsx"
import { Button } from "@medusajs/ui"

interface BitcoinPaymentButtonProps {
  amount: number
  orderId?: string
  onPaymentInitiated?: (invoiceUrl: string) => void
  className?: string
  disabled?: boolean
}

export const BitcoinPaymentButton = ({
  amount,
  orderId,
  onPaymentInitiated,
  className,
  disabled = false
}: BitcoinPaymentButtonProps) => {
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cryptoDiscount = parseInt(process.env.NEXT_PUBLIC_CRYPTO_DISCOUNT_PERCENT || "5")
  const discountedAmount = amount * (1 - cryptoDiscount / 100)
  const savings = amount - discountedAmount

  const handleBitcoinPayment = async () => {
    setIsCreatingInvoice(true)
    setError(null)

    try {
      // Create BTCPay invoice
      const response = await fetch("/api/payments/btcpay/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: discountedAmount,
          orderId,
          metadata: {
            originalAmount: amount,
            discount: cryptoDiscount,
            savings: savings
          }
        })
      })

      if (!response.ok) {
        throw new Error("Failed to create Bitcoin invoice")
      }

      const invoice = await response.json()
      
      // Open BTCPay checkout in new window
      const checkoutWindow = window.open(
        invoice.checkoutLink,
        "btcpay_checkout",
        "width=800,height=600,scrollbars=yes,resizable=yes"
      )

      onPaymentInitiated?.(invoice.checkoutLink)

      // Monitor payment status
      const pollPaymentStatus = async () => {
        try {
          const statusResponse = await fetch(`/api/payments/btcpay/status/${invoice.id}`)
          const status = await statusResponse.json()
          
          if (status.status === "Settled" || status.status === "Complete") {
            checkoutWindow?.close()
            window.location.href = `/order-confirmation?payment=success&order=${orderId}`
          } else if (status.status === "Expired" || status.status === "Invalid") {
            checkoutWindow?.close()
            setError("Payment expired or invalid. Please try again.")
          } else {
            // Continue polling
            setTimeout(pollPaymentStatus, 3000)
          }
        } catch (err) {
          console.error("Error polling payment status:", err)
        }
      }

      // Start polling after a short delay
      setTimeout(pollPaymentStatus, 5000)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setIsCreatingInvoice(false)
    }
  }

  return (
    <div className={className}>
      {/* Discount Banner */}
      <div className="bg-premium-secondary border border-premium-secondary rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">₿</span>
            <div>
              <p className="text-sm font-semibold text-premium">
                Pay with Bitcoin & Save {cryptoDiscount}%
              </p>
              <p className="text-xs text-premium">
                Lower fees passed directly to you
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-premium">
              -${savings.toFixed(2)}
            </p>
            <p className="text-xs text-premium">
              You pay: ${discountedAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <Button
        onClick={handleBitcoinPayment}
        disabled={disabled || isCreatingInvoice}
        className={clsx(
          "w-full bg-premium hover:bg-premium-hover text-premium-on-primary font-semibold py-4 rounded-lg transition-all duration-200",
          "flex items-center justify-center gap-3",
          "shadow-premium border border-premium",
          (disabled || isCreatingInvoice) && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className="text-xl">₿</span>
        {isCreatingInvoice ? (
          <span>Creating Bitcoin Invoice...</span>
        ) : (
          <span>Pay ${discountedAmount.toFixed(2)} with Bitcoin</span>
        )}
        <div className="bg-premium-on-primary text-premium px-2 py-0.5 rounded text-xs font-bold">
          SAVE {cryptoDiscount}%
        </div>
      </Button>

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-3 bg-negative-secondary border border-negative-secondary rounded-lg">
          <p className="text-sm text-negative">{error}</p>
        </div>
      )}

      {/* Bitcoin Security Features */}
      <div className="mt-4 space-y-2 text-xs text-secondary">
        <div className="flex items-center gap-2">
          <span>🔒</span>
          <span>Funds held in secure Bitcoin escrow until delivery confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <span>⚡</span>
          <span>Lightning Network supported for instant transactions</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🛡️</span>
          <span>Self-custodial payments • No KYC required</span>
        </div>
      </div>

      {/* Learn More Link */}
      <div className="mt-3 text-center">
        <button
          onClick={() => window.open("/learn/bitcoin-payments", "_blank")}
          className="text-xs text-action hover:text-action-hover underline"
        >
          New to Bitcoin? Learn how to buy and use Bitcoin safely →
        </button>
      </div>
    </div>
  )
}

export default BitcoinPaymentButton