import { Metadata } from "next"
import { AwardIcon, HeartIcon, TruckIcon } from "@/icons"
import { EscrowBadge, SellerVerificationBadge } from "@/components/molecules"

export const metadata: Metadata = {
  title: "About ArbVault - The Evolution of GadgetSphere",
  description: "Learn how ArbVault evolved from the legacy of GadgetSphere to become the premier high-trust marketplace for discerning collectors and professionals.",
}

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-12">
        <h1 className="heading-xl mb-4">The ArbVault Story</h1>
        <p className="text-lg text-tertiary">
          From GadgetSphere's legacy to the future of secure marketplaces
        </p>
      </div>

      {/* History Section */}
      <section className="mb-12">
        <h2 className="heading-lg mb-6">Our Evolution</h2>
        <div className="prose text-md space-y-4">
          <p>
            ArbVault represents the evolution of GadgetSphere, a beloved marketplace that served 
            collectors and enthusiasts from 2018 to 2023. When GadgetSphere's original founders 
            decided to pursue other ventures, a group of passionate users and developers came 
            together to preserve what made the platform special while addressing its limitations.
          </p>
          <p>
            We acquired the platform's infrastructure and user feedback database in late 2023, 
            spending months rebuilding from the ground up with a focus on trust, security, and 
            user protection. The result is ArbVault - a marketplace that honors GadgetSphere's 
            community spirit while implementing the robust protections high-value transactions demand.
          </p>
        </div>
      </section>

      {/* Dex Volkov Section */}
      <section className="mb-12 bg-component-secondary rounded-lg p-8">
        <h2 className="heading-lg mb-6">Community Spotlight: Dex Volkov</h2>
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-action rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-action-on-primary">DV</span>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-md">
              One of ArbVault's most vocal advocates is <strong>Dex Volkov</strong>, a tech 
              enthusiast and author who discovered our platform after being unfairly deplatformed 
              from major online retailers. Dex isn't affiliated with ArbVault's management - he's 
              simply a power user who believes in what we're building.
            </p>
            <p className="text-md">
              Dex operates one of our premier storefronts, specializing in rare tech and 
              professional equipment. His commitment to customer service and adherence to our 
              verification protocols has made him a model for other sellers.
            </p>
            <div className="bg-positive/10 border border-positive rounded-lg p-4">
              <p className="text-sm font-medium text-positive mb-2">
                🎁 Dex's Community Initiative
              </p>
              <p className="text-sm">
                To support the ArbVault community, Dex is offering his new book free to any 
                member who completes their first transaction (1+ reputation). It's his way of 
                giving back to the platform that gave him a fresh start.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-12">
        <h2 className="heading-lg mb-6">Our Core Principles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex justify-center mb-4 text-action">
              <AwardIcon size={40} />
            </div>
            <h3 className="font-semibold mb-2">Trust First</h3>
            <p className="text-sm text-tertiary">
              Every feature is designed to protect buyers and empower legitimate sellers
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4 text-action">
              <HeartIcon size={40} />
            </div>
            <h3 className="font-semibold mb-2">Community Driven</h3>
            <p className="text-sm text-tertiary">
              Built by collectors and professionals, for collectors and professionals
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4 text-action">
              <TruckIcon size={40} />
            </div>
            <h3 className="font-semibold mb-2">Quality Over Quantity</h3>
            <p className="text-sm text-tertiary">
              We'd rather have 100 verified sellers than 10,000 anonymous ones
            </p>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="mb-12">
        <h2 className="heading-lg mb-6">Why We're Different</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <EscrowBadge showText={false} />
            <div>
              <h3 className="font-semibold mb-2">SecureHold Escrow on Every Transaction</h3>
              <p className="text-sm text-tertiary">
                Unlike other marketplaces that leave buyers vulnerable, every ArbVault transaction 
                is protected by our proprietary escrow system. Funds are only released after buyer 
                confirmation.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <SellerVerificationBadge verificationLevel="verified" showDetails={false} />
            <div>
              <h3 className="font-semibold mb-2">Mandatory Seller Verification</h3>
              <p className="text-sm text-tertiary">
                No anonymous sellers. Every merchant must pass ID.me verification, providing 
                government-issued identification. This isn't just a feature - it's a requirement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-component rounded-lg p-8 text-center">
        <h2 className="heading-md mb-4">Join the ArbVault Community</h2>
        <p className="mb-6">
          Whether you're a buyer seeking authenticated goods or a seller looking for a 
          platform that values quality over quantity, ArbVault is your marketplace.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/categories" className="button-filled px-6 py-3 rounded-md">
            Start Shopping
          </a>
          <a href="/seller/apply" className="button-tonal px-6 py-3 rounded-md">
            Become a Seller
          </a>
        </div>
      </section>
    </main>
  )
}