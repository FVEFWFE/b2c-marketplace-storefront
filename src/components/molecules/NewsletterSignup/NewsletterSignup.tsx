"use client"

import { useState } from "react"
import { clsx } from "clsx"
import { Button } from "@medusajs/ui"

interface NewsletterSignupProps {
  variant?: "banner" | "modal" | "inline"
  className?: string
  onSignup?: (email: string) => void
}

export const NewsletterSignup = ({ 
  variant = "banner", 
  className,
  onSignup
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError("")

    try {
      // TODO: Integrate with actual newsletter API
      const response = await fetch("/api/newsletter/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      if (!response.ok) throw new Error("Signup failed")

      setIsSuccess(true)
      onSignup?.(email)
    } catch (err) {
      setError("Failed to sign up. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={clsx(
        "flex items-center justify-center p-4 rounded-lg",
        variant === "banner" && "bg-positive-secondary border border-positive-secondary",
        variant === "modal" && "bg-positive-secondary p-6",
        variant === "inline" && "bg-positive-secondary",
        className
      )}>
        <div className="text-center">
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="font-semibold text-positive mb-1">Welcome to ArbVault!</h3>
          <p className="text-sm text-positive">
            Check your email for your exclusive 5% discount code.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(
      "flex items-center justify-between p-4 rounded-lg",
      variant === "banner" && "bg-action-secondary border border-action",
      variant === "modal" && "bg-white p-6 shadow-trust",
      variant === "inline" && "bg-component-secondary",
      className
    )}>
      <div className="flex-1 mr-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">💎</span>
          <h3 className="font-semibold text-action">Get 5% off your first order</h3>
        </div>
        <p className="text-sm text-secondary">
          Join ArbVault's premium marketplace and save on your first purchase.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 min-w-fit">
        <div className="flex-1 min-w-[200px]">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-3 py-2 border border-primary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-action focus:border-action"
            disabled={isLoading}
          />
          {error && (
            <p className="text-xs text-negative mt-1">{error}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isLoading || !email}
          className="bg-action hover:bg-action-hover text-action-on-primary px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {isLoading ? "..." : "Get Discount"}
        </Button>
      </form>
    </div>
  )
}

export default NewsletterSignup