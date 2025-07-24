import { clsx } from "clsx"

interface TrustBadgeProps {
  type: "verified" | "escrow" | "signature" | "insured" | "id_verified" | "charter_seller"
  size?: "sm" | "md" | "lg"
  className?: string
  showText?: boolean
}

const badgeConfig = {
  verified: {
    icon: "✅",
    text: "KYC Verified",
    bgColor: "bg-positive-secondary",
    textColor: "text-positive",
    borderColor: "border-positive-secondary"
  },
  escrow: {
    icon: "🛡️",
    text: "SecureHold Escrow",
    bgColor: "bg-action-secondary",
    textColor: "text-action",
    borderColor: "border-action"
  },
  signature: {
    icon: "📝",
    text: "Signature Required",
    bgColor: "bg-warning-secondary",
    textColor: "text-warning",
    borderColor: "border-warning-secondary"
  },
  insured: {
    icon: "🔒",
    text: "UPS Capital Insured",
    bgColor: "bg-premium-secondary",
    textColor: "text-premium",
    borderColor: "border-premium-secondary"
  },
  id_verified: {
    icon: "🆔",
    text: "ID.me Verified",
    bgColor: "bg-positive-secondary",
    textColor: "text-positive",
    borderColor: "border-positive-secondary"
  },
  charter_seller: {
    icon: "⭐",
    text: "Charter Seller",
    bgColor: "bg-premium-secondary",
    textColor: "text-premium",
    borderColor: "border-premium-secondary"
  }
}

const sizeConfig = {
  sm: {
    padding: "px-2 py-1",
    textSize: "text-xs",
    iconSize: "text-sm"
  },
  md: {
    padding: "px-3 py-1.5",
    textSize: "text-sm",
    iconSize: "text-base"
  },
  lg: {
    padding: "px-4 py-2",
    textSize: "text-base",
    iconSize: "text-lg"
  }
}

export const TrustBadge = ({ 
  type, 
  size = "md", 
  className, 
  showText = true 
}: TrustBadgeProps) => {
  const badge = badgeConfig[type]
  const sizeClasses = sizeConfig[size]

  return (
    <div className={clsx(
      "inline-flex items-center gap-1.5 rounded-full border font-medium",
      badge.bgColor,
      badge.textColor,
      badge.borderColor,
      sizeClasses.padding,
      sizeClasses.textSize,
      className
    )}>
      <span className={sizeClasses.iconSize}>{badge.icon}</span>
      {showText && <span>{badge.text}</span>}
    </div>
  )
}

export default TrustBadge