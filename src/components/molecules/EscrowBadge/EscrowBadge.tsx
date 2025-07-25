import { AwardIcon } from "@/icons"
import { Badge } from "@/components/atoms"

interface EscrowBadgeProps {
  className?: string
  showText?: boolean
}

export function EscrowBadge({ className = "", showText = true }: EscrowBadgeProps) {
  const escrowName = "SecureHold Escrow 🛡️"
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge className="bg-positive text-positive-on-primary border-positive flex items-center gap-1 px-3 py-1">
        <AwardIcon size={16} />
        {showText && <span className="text-sm font-medium">{escrowName}</span>}
      </Badge>
    </div>
  )
}