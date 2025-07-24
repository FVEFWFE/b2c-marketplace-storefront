import {
  AlgoliaTrendingListings,
  BannerSection,
  BlogSection,
  Hero,
  HomeCategories,
  HomePopularBrandsSection,
  HomeProductSection,
  ShopByStyleSection,
} from "@/components/sections"

import type { Metadata } from "next"
import NewsletterSignup from "@/components/molecules/NewsletterSignup/NewsletterSignup"
import LiveChat from "@/components/molecules/LiveChat/LiveChat"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to ArbVault - The premier, high-trust, curated marketplace for discerning collectors and professionals. Specializing in high-value, authenticated goods with SecureHold Escrow protection.",
  openGraph: {
    title: "ArbVault - Premium Curated Marketplace",
    description:
      "The premier, high-trust, curated marketplace for discerning collectors and professionals. Featuring KYC-verified sellers, SecureHold Escrow protection, and Bitcoin payments with 5% discount.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "ArbVault - Premium Curated Marketplace",
    type: "website",
    images: [
      {
        url: "/ArbVault_Open_Graph.png",
        width: 1200,
        height: 630,
        alt: "ArbVault - Premium Curated Marketplace",
      },
    ],
  },
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-primary">
      {/* Hero Section */}
      <Hero
        image="/images/hero/arbvault-hero.jpg"
        heading="Premium goods, verified sellers, secured transactions"
        paragraph="The trusted marketplace for high-value items. Every seller KYC-verified, every transaction protected by SecureHold Escrow, every shipment insured and tracked."
        buttons={[
          { label: "Browse Premium Collection", path: "/categories" },
          {
            label: "Become a Verified Seller",
            path: process.env.NEXT_PUBLIC_VENDOR_PANEL_URL || "https://vendor.arbvault.io",
          },
        ]}
      />

      {/* Newsletter Signup with Discount */}
      <div className="px-4 lg:px-8 w-full">
        <NewsletterSignup variant="banner" />
      </div>

      {/* Trust Statistics */}
      <div className="px-4 lg:px-8 w-full">
        <div className="bg-component-secondary border border-primary rounded-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-premium">$50M+</div>
              <div className="text-sm text-secondary">Secure Transactions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-positive">50K+</div>
              <div className="text-sm text-secondary">Verified Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-action">99.8%</div>
              <div className="text-sm text-secondary">Successful Deliveries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-premium">24/7</div>
              <div className="text-sm text-secondary">Escrow Protection</div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Categories Showcase */}
      <div className="px-4 lg:px-8 w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Curated Premium Categories</h2>
          <p className="text-secondary">
            Authenticated goods from verified professionals • All items in-stock with same-day shipping
          </p>
        </div>
        <HomeCategories heading="" />
      </div>

      {/* Trending High-Value Listings */}
      <div className="px-4 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">Premium Marketplace</h2>
            <p className="text-secondary">Handpicked by Dex Volkov and verified sellers</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <span>🔒</span>
            <span>All items ship today with tracking</span>
          </div>
        </div>
        <HomeProductSection heading="" locale={locale} home />
      </div>

      {/* Trust & Security Section */}
      <div className="px-4 lg:px-8 w-full">
        <div className="bg-action-secondary border border-action rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🛡️</div>
            <h2 className="text-2xl font-bold text-action mb-2">Why ArbVault?</h2>
            <p className="text-action">The only marketplace built specifically for high-value, authenticated goods</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl mb-3">✅</div>
              <h3 className="font-semibold text-action mb-2">KYC Verified Sellers</h3>
              <p className="text-sm text-action">
                Every seller undergoes ID.me verification. No anonymous accounts, no dropshippers.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-3">🛡️</div>
              <h3 className="font-semibold text-action mb-2">SecureHold Escrow</h3>
              <p className="text-sm text-action">
                Your payment is protected until you confirm receipt. Full refund guarantee.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-3">🔒</div>
              <h3 className="font-semibold text-action mb-2">Insured Shipping</h3>
              <p className="text-sm text-action">
                UPS Capital insurance on all orders. Signature required, discrete packaging.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bitcoin Payments CTA */}
      <div className="px-4 lg:px-8 w-full">
        <div className="bg-premium-secondary border border-premium-secondary rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">₿</div>
              <div>
                <h3 className="font-bold text-premium">Pay with Bitcoin & Save 5%</h3>
                <p className="text-sm text-premium">
                  Privacy-focused payments with Lightning Network support
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-premium text-premium-on-primary px-4 py-2 rounded-lg font-bold">
                SAVE 5%
              </div>
              <p className="text-xs text-premium mt-1">No KYC required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dex Volkov Book Offer */}
      <div className="px-4 lg:px-8 w-full">
        <div className="bg-component-secondary border border-premium rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-20 bg-premium-secondary border border-premium-secondary rounded flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-premium font-semibold">Dex Volkov</span>
                <span className="px-2 py-0.5 bg-premium-secondary text-premium text-xs rounded-full">
                  Power User
                </span>
              </div>
              <h3 className="font-bold text-primary mb-2">
                Free Book: "Building Trust in Digital Marketplaces"
              </h3>
              <p className="text-sm text-secondary mb-3">
                Available free to any ArbVault member with 1+ reputation score. 
                Complete your first successful transaction to qualify.
              </p>
              <div className="text-xs text-premium">
                "After being unfairly banned from Amazon, I found ArbVault to be the perfect platform 
                for serious collectors and professionals." - Dex Volkov
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Content Sections */}
      <BannerSection />
      <ShopByStyleSection />
      <BlogSection />

      {/* Live Chat for High-Value Support */}
      <LiveChat autoShow={false} triggerAmount={1000} />
    </main>
  )
}
