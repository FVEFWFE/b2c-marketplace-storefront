"use client"

import { useState } from "react"
import { clsx } from "clsx"
import { Button } from "@medusajs/ui"

interface BitcoinGuideProps {
  className?: string
  showDiscount?: boolean
}

export const BitcoinGuide = ({ className, showDiscount = true }: BitcoinGuideProps) => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: "Why Bitcoin for Premium Purchases?",
      icon: "₿",
      content: (
        <div className="space-y-4">
          <p className="text-secondary">
            Bitcoin offers unique advantages for high-value marketplace transactions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-positive-secondary border border-positive-secondary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>🛡️</span>
                <h4 className="font-semibold text-positive">Enhanced Privacy</h4>
              </div>
              <p className="text-sm text-positive">
                No KYC required, protecting your identity and purchase history from data breaches.
              </p>
            </div>
            <div className="bg-premium-secondary border border-premium-secondary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <h4 className="font-semibold text-premium">Lower Fees</h4>
              </div>
              <p className="text-sm text-premium">
                Save 5% on every purchase - we pass our savings from lower processing fees to you.
              </p>
            </div>
            <div className="bg-action-secondary border border-action rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>🌍</span>
                <h4 className="font-semibold text-action">Global Access</h4>
              </div>
              <p className="text-sm text-action">
                No geographic restrictions or currency conversion fees.
              </p>
            </div>
            <div className="bg-component-secondary border border-primary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>⚡</span>
                <h4 className="font-semibold text-primary">Fast Settlement</h4>
              </div>
              <p className="text-sm text-secondary">
                Lightning Network support for instant, low-cost transactions.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Step 1: Get a Bitcoin Wallet",
      icon: "📱",
      content: (
        <div className="space-y-4">
          <p className="text-secondary">
            Choose a reputable wallet to store your Bitcoin safely:
          </p>
          <div className="space-y-3">
            <div className="bg-component-secondary border border-primary rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-2">Recommended Mobile Wallets</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <div>
                    <p className="font-medium text-sm">Phoenix Wallet</p>
                    <p className="text-xs text-secondary">Lightning + On-chain</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔷</span>
                  <div>
                    <p className="font-medium text-sm">Blue Wallet</p>
                    <p className="text-xs text-secondary">Beginner friendly</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-component-secondary border border-primary rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-2">Hardware Wallets (Most Secure)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <div>
                    <p className="font-medium text-sm">Ledger Nano X</p>
                    <p className="text-xs text-secondary">Industry standard</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>🛡️</span>
                  <div>
                    <p className="font-medium text-sm">Trezor Model T</p>
                    <p className="text-xs text-secondary">Open source</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Step 2: Buy Bitcoin",
      icon: "💳",
      content: (
        <div className="space-y-4">
          <p className="text-secondary">
            Purchase Bitcoin from a reputable exchange:
          </p>
          <div className="space-y-3">
            <div className="bg-component-secondary border border-primary rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-3">Recommended Exchanges</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>🏢</span>
                    <div>
                      <p className="font-medium text-sm">Coinbase</p>
                      <p className="text-xs text-secondary">Beginner-friendly, regulated</p>
                    </div>
                  </div>
                  <span className="text-xs text-premium">KYC Required</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>🔄</span>
                    <div>
                      <p className="font-medium text-sm">Kraken</p>
                      <p className="text-xs text-secondary">Low fees, advanced features</p>
                    </div>
                  </div>
                  <span className="text-xs text-premium">KYC Required</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>🤝</span>
                    <div>
                      <p className="font-medium text-sm">Bisq</p>
                      <p className="text-xs text-secondary">Decentralized, peer-to-peer</p>
                    </div>
                  </div>
                  <span className="text-xs text-positive">No KYC</span>
                </div>
              </div>
            </div>
            <div className="bg-warning-secondary border border-warning-secondary rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span>⚠️</span>
                <div>
                  <p className="font-semibold text-warning text-sm">Security Tips</p>
                  <ul className="text-xs text-warning mt-1 space-y-1">
                    <li>• Start with small amounts to test the process</li>
                    <li>• Enable 2FA on all exchange accounts</li>
                    <li>• Transfer Bitcoin to your own wallet immediately after purchase</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Step 3: Make Your First Purchase",
      icon: "🛒",
      content: (
        <div className="space-y-4">
          <p className="text-secondary">
            Ready to use Bitcoin on ArbVault? Here's how it works:
          </p>
          <div className="space-y-3">
            <div className="bg-positive-secondary border border-positive-secondary rounded-lg p-4">
              <h4 className="font-semibold text-positive mb-3">ArbVault Bitcoin Payment Process</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-positive text-positive-on-primary rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <p className="font-medium text-sm text-positive">Select Bitcoin at Checkout</p>
                    <p className="text-xs text-positive mt-1">Automatic 5% discount applied</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-positive text-positive-on-primary rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <p className="font-medium text-sm text-positive">Scan QR Code or Copy Address</p>
                    <p className="text-xs text-positive mt-1">Use your wallet to send the exact amount</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-positive text-positive-on-primary rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <p className="font-medium text-sm text-positive">Automatic Confirmation</p>
                    <p className="text-xs text-positive mt-1">Order processed once payment is confirmed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-action-secondary border border-action rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>🛡️</span>
                <h4 className="font-semibold text-action">Bitcoin Escrow Protection</h4>
              </div>
              <p className="text-sm text-action">
                Your Bitcoin payment is held in secure multi-signature escrow until you confirm receipt of your item. 
                This provides the same protection as traditional payment methods.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className={clsx("max-w-4xl mx-auto", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">₿</div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          How to Safely Acquire and Use Bitcoin
        </h2>
        <p className="text-secondary">
          Your complete guide to using Bitcoin for secure, private, high-value purchases
        </p>
        {showDiscount && (
          <div className="mt-4 inline-flex items-center gap-2 bg-premium-secondary border border-premium-secondary rounded-full px-4 py-2">
            <span className="text-premium font-semibold">💰 Save 5% with Bitcoin payments</span>
          </div>
        )}
      </div>

      {/* Step Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setActiveStep(index)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
              activeStep === index
                ? "bg-action text-action-on-primary"
                : "bg-component-secondary text-secondary hover:bg-component-primary"
            )}
          >
            <span>{step.icon}</span>
            <span className="hidden sm:inline">{step.title}</span>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-component-primary border border-primary rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-action text-action-on-primary rounded-full flex items-center justify-center text-xl">
            {steps[activeStep].icon}
          </div>
          <h3 className="text-xl font-bold text-primary">{steps[activeStep].title}</h3>
        </div>
        {steps[activeStep].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          variant="secondary"
          className="flex items-center gap-2"
        >
          ← Previous
        </Button>
        <Button
          onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
          disabled={activeStep === steps.length - 1}
          className="flex items-center gap-2 bg-action hover:bg-action-hover text-action-on-primary"
        >
          Next →
        </Button>
      </div>

      {/* Support */}
      <div className="mt-8 text-center">
        <div className="bg-component-secondary border border-primary rounded-lg p-4">
          <p className="text-sm text-secondary mb-2">
            Need help with Bitcoin payments? Our crypto specialists are here to help.
          </p>
          <Button
            onClick={() => window.open("mailto:crypto-support@arbvault.io", "_blank")}
            variant="secondary"
            className="text-sm"
          >
            Contact Crypto Support
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BitcoinGuide