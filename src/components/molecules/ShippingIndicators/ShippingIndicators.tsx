import { clsx } from "clsx"
import TrustBadge from "@/components/atoms/TrustBadge/TrustBadge"

interface ShippingIndicatorsProps {
  productValue: number
  className?: string
  showDetails?: boolean
}

export const ShippingIndicators = ({
  productValue,
  className,
  showDetails = true
}: ShippingIndicatorsProps) => {
  const getShippingFeatures = (value: number) => {
    const features = [
      {
        icon: "📦",
        title: "Same-Day Shipping",
        description: "All items ship within 24 hours",
        enabled: true
      },
      {
        icon: "📝",
        title: "Signature Required",
        description: "Adult signature required for delivery",
        enabled: value >= 500
      },
      {
        icon: "🔒",
        title: "UPS Capital Insured",
        description: `Fully insured up to $${value.toLocaleString()}`,
        enabled: value >= 1000
      },
      {
        icon: "🛡️",
        title: "Route Package Protection",
        description: "Protection against loss, theft, or damage",
        enabled: value >= 250
      },
      {
        icon: "📍",
        title: "Precision Delivery",
        description: "What3Words location for secure delivery",
        enabled: value >= 2000
      },
      {
        icon: "🚚",
        title: "Discrete Packaging",
        description: "No external branding or value indicators",
        enabled: true
      },
      {
        icon: "📲",
        title: "Real-Time Tracking",
        description: "UPS/DHL tracking with SMS/email updates",
        enabled: true
      }
    ]

    return features.filter(feature => feature.enabled)
  }

  const shippingFeatures = getShippingFeatures(productValue)

  const getCarrierInfo = (value: number) => {
    if (value >= 5000) {
      return { carrier: "UPS Next Day Air", logo: "🟤", priority: "PRIORITY" }
    } else if (value >= 2000) {
      return { carrier: "UPS 2nd Day Air", logo: "🟤", priority: "EXPRESS" }
    } else {
      return { carrier: "UPS Ground", logo: "🟤", priority: "STANDARD" }
    }
  }

  const carrierInfo = getCarrierInfo(productValue)

  return (
    <div className={clsx("space-y-4", className)}>
      {/* Shipping Method */}
      <div className="bg-positive-secondary border border-positive-secondary rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{carrierInfo.logo}</span>
            <div>
              <p className="font-semibold text-positive">{carrierInfo.carrier}</p>
              <p className="text-xs text-positive">Estimated delivery: Tomorrow</p>
            </div>
          </div>
          <div className="bg-positive text-positive-on-primary px-2 py-1 rounded text-xs font-bold">
            {carrierInfo.priority}
          </div>
        </div>
        <div className="text-sm text-positive">
          <p className="font-medium">✅ FREE Shipping - No minimum order</p>
          <p className="text-xs mt-1">Tracking number provided within 1 hour of shipment</p>
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-2 gap-2">
        {shippingFeatures.map((feature, index) => (
          <div
            key={index}
            className="bg-component-secondary border border-primary rounded-lg p-3"
          >
            <div className="flex items-start gap-2">
              <span className="text-sm">{feature.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-primary">{feature.title}</p>
                {showDetails && (
                  <p className="text-xs text-secondary mt-0.5 leading-tight">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insurance Details */}
      {productValue >= 1000 && (
        <div className="bg-premium-secondary border border-premium-secondary rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏛️</span>
            <h4 className="font-semibold text-premium">UPS Capital Insurance Coverage</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-premium uppercase tracking-wide">Coverage Amount</p>
              <p className="font-bold text-premium">${productValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-premium uppercase tracking-wide">Deductible</p>
              <p className="font-bold text-premium">$0</p>
            </div>
          </div>
          <div className="mt-3 p-2 bg-premium-secondary rounded text-xs text-premium">
            <p className="font-medium">Coverage includes:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Loss or theft during transit</li>
              <li>Damage to item or packaging</li>
              <li>Delayed delivery compensation</li>
              <li>Full replacement value guarantee</li>
            </ul>
          </div>
        </div>
      )}

      {/* Escrow Protection */}
      <div className="bg-action-secondary border border-action rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🛡️</span>
          <h4 className="font-semibold text-action">SecureHold Escrow Protection</h4>
        </div>
        <div className="text-sm text-action space-y-2">
          <p>Your payment is held in secure escrow until:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Item is delivered and confirmed by tracking</li>
            <li>You confirm receipt and satisfaction</li>
            <li>7-day inspection period passes (optional)</li>
          </ul>
          <div className="bg-action-secondary rounded p-2 mt-3">
            <p className="font-medium text-xs">
              🔒 Funds released only after successful delivery confirmation
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Guarantee */}
      <div className="bg-component-secondary border border-primary rounded-lg p-3">
        <div className="text-center">
          <div className="text-2xl mb-2">⚡</div>
          <p className="font-bold text-primary">ArbVault Delivery Guarantee</p>
          <p className="text-sm text-secondary mt-1">
            If your item doesn't arrive as expected, we'll make it right with a full refund or replacement.
          </p>
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <span>✅</span>
              <span>On-time delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span>Condition guarantee</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💰</span>
              <span>Money-back promise</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingIndicators