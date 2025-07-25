import { AwardIcon, TickHeavyIcon, TruckIcon, DollarIcon } from "@/icons"
import { EscrowBadge, SellerVerificationBadge } from "@/components/molecules"

interface TrustFeature {
  icon: React.ReactNode
  title: string
  description: string
}

export function TrustSection() {
  const features: TrustFeature[] = [
    {
      icon: <AwardIcon size={32} />,
      title: "SecureHold Escrow 🛡️",
      description: "Every transaction protected. Funds released only after buyer confirmation.",
    },
    {
      icon: <TickHeavyIcon size={32} />,
      title: "ID.me Verified Sellers",
      description: "Government ID verification required for all sellers. No anonymous transactions.",
    },
    {
      icon: <TruckIcon size={32} />,
      title: "Insured Shipping",
      description: "All high-value items shipped with full insurance and signature confirmation.",
    },
    {
      icon: <DollarIcon size={32} />,
      title: "Price Match Guarantee",
      description: "AI-powered price tracking ensures you get the best deal vs retail.",
    },
  ]

  return (
    <section className="w-full bg-component-secondary py-16">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Why Trust ArbVault?</h2>
          <p className="text-lg text-tertiary max-w-2xl mx-auto">
            We've built the most secure marketplace for high-value transactions. 
            Every feature is designed to protect buyers and empower legitimate sellers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4 text-action">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-tertiary">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary rounded-lg p-8 text-center">
          <h3 className="heading-md mb-6">See Our Trust Features in Action</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <EscrowBadge />
            <SellerVerificationBadge verificationLevel="verified" showDetails={false} />
            <SellerVerificationBadge verificationLevel="premium" showDetails={false} />
          </div>
          <p className="text-sm text-tertiary mt-6">
            Every seller on ArbVault goes through our rigorous verification process
          </p>
        </div>
      </div>
    </section>
  )
}