import {
  AlgoliaTrendingListings,
  BannerSection,
  BlogSection,
  Hero,
  HomeCategories,
  HomePopularBrandsSection,
  HomeProductSection,
  ShopByStyleSection,
  TrustSection,
} from "@/components/sections"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ArbVault - Premier High-Trust Marketplace",
  description:
    "The Premier High-Trust Marketplace for Discerning Collectors and Professionals. Secure escrow, verified sellers, and authenticated high-value goods.",
  openGraph: {
    title: "ArbVault - Premier High-Trust Marketplace",
    description:
      "The Premier High-Trust Marketplace for Discerning Collectors and Professionals. Secure escrow, verified sellers, and authenticated high-value goods.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "ArbVault",
    type: "website",
    images: [
      {
        url: "/arbvault-og.png",
        width: 1200,
        height: 630,
        alt: "ArbVault - Premier High-Trust Marketplace",
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
      <Hero
        image="/images/hero/hero-arbvault.jpg"
        heading="High-Value Goods. Verified Sellers. Secure Transactions."
        paragraph="ArbVault: The premier marketplace for authenticated luxury tech, pro equipment, and collector items. Every transaction protected by SecureHold Escrow 🛡️"
        buttons={[
          { label: "Browse Premium Inventory", path: "/categories" },
          {
            label: "Become a Verified Seller",
            path: "/seller/apply",
          },
        ]}
      />
      
      {/* Trust Indicators Banner */}
      <div className="w-full bg-component px-4 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-action">$5M+</h3>
            <p className="text-sm text-tertiary">Protected by Escrow</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-action">100%</h3>
            <p className="text-sm text-tertiary">ID Verified Sellers</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-action">24hr</h3>
            <p className="text-sm text-tertiary">Shipping Guarantee</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-action">0%</h3>
            <p className="text-sm text-tertiary">Fraud Rate</p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 w-full">
        <HomeProductSection heading="Featured High-Value Items" locale={locale} home />
      </div>
      
      <TrustSection />
      
      <div className="px-4 lg:px-8 w-full">
        <HomeCategories heading="PREMIUM CATEGORIES" />
      </div>
      
      <BannerSection />
      <ShopByStyleSection />
      <BlogSection />
    </main>
  )
}
