import { TickHeavyIcon, AwardIcon, StarIcon } from "@/icons"
import { Badge } from "@/components/atoms"

interface VerificationLevel {
  icon: React.ReactNode
  text: string
  color: string
  description: string
}

interface SellerVerificationBadgeProps {
  verificationLevel?: "basic" | "verified" | "premium"
  showDetails?: boolean
  className?: string
  sellerId?: string
  sellerName?: string
  totalSales?: number
  rating?: number
}

export function SellerVerificationBadge({
  verificationLevel = "verified",
  showDetails = true,
  className = "",
  sellerId,
  sellerName,
  totalSales = 0,
  rating = 5.0,
}: SellerVerificationBadgeProps) {
  const verificationLevels: Record<string, VerificationLevel> = {
    basic: {
      icon: <TickHeavyIcon size={14} />,
      text: "Basic Verified",
      color: "bg-component-secondary text-secondary",
      description: "Email and phone verified",
    },
    verified: {
      icon: <AwardIcon size={14} />,
      text: "ID.me Verified ✓",
      color: "bg-action text-action-on-primary",
      description: "Government ID verified seller",
    },
    premium: {
      icon: <StarIcon size={14} />,
      text: "Premium Seller ⭐",
      color: "bg-warning text-warning-on-primary",
      description: "Top-rated verified business",
    },
  }

  const level = verificationLevels[verificationLevel]

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2">
        <Badge className={`${level.color} flex items-center gap-1 px-3 py-1`}>
          {level.icon}
          <span className="text-sm font-semibold">{level.text}</span>
        </Badge>
        
        {showDetails && totalSales > 0 && (
          <div className="flex items-center gap-3 text-xs text-tertiary">
            <span>{totalSales}+ sales</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <StarIcon size={12} />
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      
      {showDetails && (
        <p className="text-xs text-tertiary mt-1">{level.description}</p>
      )}
    </div>
  )
}