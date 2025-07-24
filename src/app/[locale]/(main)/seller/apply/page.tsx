import { Metadata } from "next"
import { TickHeavyIcon, AwardIcon, DollarIcon, HeartIcon } from "@/icons"
import { SellerVerificationBadge } from "@/components/molecules"

export const metadata: Metadata = {
  title: "Become a Verified Seller - ArbVault",
  description: "Join ArbVault as a verified seller. ID verification required. Access to high-value buyers and secure transactions.",
}

export default function SellerApplyPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="heading-xl mb-4">Become a Verified ArbVault Seller</h1>
        <p className="text-lg text-tertiary">
          Join the premier marketplace for high-value goods. Quality over quantity.
        </p>
      </div>

      {/* Requirements Section */}
      <section className="mb-12 bg-negative/5 border border-negative rounded-lg p-6">
        <h2 className="heading-md mb-4 text-negative">Strict Requirements - By Design</h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <TickHeavyIcon size={20} className="text-negative flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">Government ID Verification (ID.me)</p>
              <p className="text-sm text-tertiary">No exceptions. Every seller must verify their identity.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <TickHeavyIcon size={20} className="text-negative flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">Business Documentation</p>
              <p className="text-sm text-tertiary">Proof of inventory ownership and business registration.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <TickHeavyIcon size={20} className="text-negative flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">No Dropshipping</p>
              <p className="text-sm text-tertiary">All items must be in your possession. We verify this.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-12">
        <h2 className="heading-lg mb-6">Why Sell on ArbVault?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-secondary rounded-lg p-6">
            <DollarIcon size={32} className="text-action mb-4" />
            <h3 className="font-semibold mb-2">Access to High-Value Buyers</h3>
            <p className="text-sm text-tertiary">
              Our buyers trust us because we verify you. Average transaction value: $2,500+
            </p>
          </div>
          <div className="border border-secondary rounded-lg p-6">
            <AwardIcon size={32} className="text-action mb-4" />
            <h3 className="font-semibold mb-2">SecureHold Escrow Protection</h3>
            <p className="text-sm text-tertiary">
              Get paid reliably. Escrow protects both parties and builds trust.
            </p>
          </div>
          <div className="border border-secondary rounded-lg p-6">
            <HeartIcon size={32} className="text-action mb-4" />
            <h3 className="font-semibold mb-2">Premium Seller Support</h3>
            <p className="text-sm text-tertiary">
              Dedicated support team, API access, and marketing tools for serious sellers.
            </p>
          </div>
          <div className="border border-secondary rounded-lg p-6">
            <TickHeavyIcon size={32} className="text-action mb-4" />
            <h3 className="font-semibold mb-2">Stand Out From the Crowd</h3>
            <p className="text-sm text-tertiary">
              Your verification badge means something here. Buyers know you're legitimate.
            </p>
          </div>
        </div>
      </section>

      {/* Verification Levels */}
      <section className="mb-12">
        <h2 className="heading-lg mb-6">Seller Verification Levels</h2>
        <div className="space-y-4">
          <div className="border border-secondary rounded-lg p-6">
            <SellerVerificationBadge verificationLevel="basic" showDetails={false} />
            <h3 className="font-semibold mt-3 mb-2">Basic Verified</h3>
            <p className="text-sm text-tertiary mb-2">Requirements:</p>
            <ul className="text-sm text-tertiary space-y-1">
              <li>• Email and phone verification</li>
              <li>• Basic business information</li>
              <li>• $100 security deposit</li>
            </ul>
          </div>
          <div className="border border-action rounded-lg p-6 bg-action/5">
            <SellerVerificationBadge verificationLevel="verified" showDetails={false} />
            <h3 className="font-semibold mt-3 mb-2">ID.me Verified (Recommended)</h3>
            <p className="text-sm text-tertiary mb-2">Requirements:</p>
            <ul className="text-sm text-tertiary space-y-1">
              <li>• Government ID verification via ID.me</li>
              <li>• Business registration documents</li>
              <li>• Proof of inventory</li>
              <li>• $500 security deposit</li>
            </ul>
          </div>
          <div className="border border-warning rounded-lg p-6 bg-warning/5">
            <SellerVerificationBadge verificationLevel="premium" showDetails={false} />
            <h3 className="font-semibold mt-3 mb-2">Premium Seller (Invitation Only)</h3>
            <p className="text-sm text-tertiary mb-2">Benefits:</p>
            <ul className="text-sm text-tertiary space-y-1">
              <li>• Featured placement in search results</li>
              <li>• Lower transaction fees (5% vs 8%)</li>
              <li>• Priority support</li>
              <li>• Custom storefront options</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="mb-12">
        <h2 className="heading-lg mb-6">Application Process</h2>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-10 h-10 bg-action text-action-on-primary rounded-full flex items-center justify-center font-bold">1</span>
            <div>
              <h3 className="font-semibold mb-1">Submit Initial Application</h3>
              <p className="text-sm text-tertiary">Basic information about you and your business</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-10 h-10 bg-action text-action-on-primary rounded-full flex items-center justify-center font-bold">2</span>
            <div>
              <h3 className="font-semibold mb-1">Complete ID Verification</h3>
              <p className="text-sm text-tertiary">Verify your identity through ID.me (takes 5-10 minutes)</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-10 h-10 bg-action text-action-on-primary rounded-full flex items-center justify-center font-bold">3</span>
            <div>
              <h3 className="font-semibold mb-1">Submit Documentation</h3>
              <p className="text-sm text-tertiary">Business registration, inventory proof, and references</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-10 h-10 bg-action text-action-on-primary rounded-full flex items-center justify-center font-bold">4</span>
            <div>
              <h3 className="font-semibold mb-1">Review & Approval</h3>
              <p className="text-sm text-tertiary">Our team reviews applications within 48 hours</p>
            </div>
          </li>
        </ol>
      </section>

      {/* CTA Section */}
      <section className="bg-component rounded-lg p-8 text-center">
        <h2 className="heading-md mb-4">Ready to Join ArbVault?</h2>
        <p className="mb-6">
          We're selective because our buyers deserve the best. If you meet our standards, 
          you'll have access to a marketplace where quality is valued over quantity.
        </p>
        <div className="flex gap-4 justify-center">
          <a 
            href="https://vendor.arbvault.io/apply" 
            className="button-filled px-8 py-3 rounded-md inline-block"
          >
            Start Application
          </a>
          <a 
            href="/seller-verification" 
            className="button-tonal px-8 py-3 rounded-md inline-block"
          >
            Learn More
          </a>
        </div>
        <p className="text-xs text-tertiary mt-4">
          Application fee: $25 (credited to your account upon approval)
        </p>
      </section>
    </main>
  )
}