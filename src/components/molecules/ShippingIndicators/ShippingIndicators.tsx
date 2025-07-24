import { TruckIcon, TickHeavyIcon, LocationIcon, AwardIcon } from "@/icons"
import { Badge } from "@/components/atoms"

interface ShippingIndicator {
  icon: React.ReactNode
  text: string
  tooltip?: string
}

interface ShippingIndicatorsProps {
  showSignatureRequired?: boolean
  showInsuredShipping?: boolean
  showExpressDelivery?: boolean
  showTrackingAvailable?: boolean
  className?: string
}

export function ShippingIndicators({
  showSignatureRequired = true,
  showInsuredShipping = true,
  showExpressDelivery = true,
  showTrackingAvailable = true,
  className = "",
}: ShippingIndicatorsProps) {
  const indicators: ShippingIndicator[] = []

  if (showSignatureRequired) {
    indicators.push({
      icon: <TickHeavyIcon size={14} />,
      text: "Signature Required",
      tooltip: "Package requires signature upon delivery for security",
    })
  }

  if (showInsuredShipping) {
    indicators.push({
      icon: <AwardIcon size={14} />,
      text: "Fully Insured",
      tooltip: "Shipment is insured for full value",
    })
  }

  if (showExpressDelivery) {
    indicators.push({
      icon: <TruckIcon size={14} />,
      text: "Express Shipping",
      tooltip: "Same-day processing with UPS/DHL tracking",
    })
  }

  if (showTrackingAvailable) {
    indicators.push({
      icon: <LocationIcon size={14} />,
      text: "Live Tracking",
      tooltip: "Real-time package tracking available",
    })
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {indicators.map((indicator, index) => (
        <Badge
          key={index}
          className="bg-component-secondary text-secondary border-secondary flex items-center gap-1 px-2 py-1"
          title={indicator.tooltip}
        >
          {indicator.icon}
          <span className="text-xs font-medium">{indicator.text}</span>
        </Badge>
      ))}
    </div>
  )
}